/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { validateSaveQuestionBank } = require('../../validations/forms');
const { updateQuestion } = require('../questions/updateQuestion');
const { createQuestion } = require('../questions/createQuestion');
const {
  removeSubjectsFromQuestionBanks,
} = require('../question-bank-subjects/removeSubjectsFromQuestionBanks');
const {
  addSubjectsToQuestionBanks,
} = require('../question-bank-subjects/addSubjectsToQuestionBanks');
const { updateCategory } = require('../question-bank-categories/updateCategory');
const { createCategory } = require('../question-bank-categories/createCategory');
const { deleteQuestions } = require('../questions/deleteQuestions');

async function saveQuestionsBanks(_data, { userSession, transacting: _transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  const versionControlService = leemons.getPlugin('common').services.versionControl;
  return global.utils.withTransaction(
    async (transacting) => {
      const data = _.cloneDeep(_data);
      delete data.asset;
      _.forEach(data.questions, (question) => {
        delete question.questionBank;
        delete question.deleted;
        delete question.created_at;
        delete question.updated_at;
        delete question.deleted_at;
      });
      // Check is userSession is provided
      if (!userSession) throw new Error('User session is required (saveQuestionsBanks)');
      validateSaveQuestionBank(data);
      const { id, questions, categories, tags, published, subjects, ...props } = data;
      let questionBank;

      if (id) {
        let version = await versionControlService.getVersion(id, { transacting });

        if (version.published) {
          version = await versionControlService.upgradeVersion(id, 'major', {
            published,
            setAsCurrent: true,
            transacting,
          });
          const [_questionBank, oldCategories] = await Promise.all([
            table.questionsBanks.create({ id: version.fullId, ...props }, { transacting }),
            table.questionBankCategories.find(
              { questionBank: id },
              {
                transacting,
              }
            ),
          ]);
          questionBank = _questionBank;
          const oldCategoriesById = _.keyBy(oldCategories, 'id');

          // ES - Borramos las id para que se creen nuevas
          // EN - Delete the id to create new
          _.forEach(data.questions, (question) => {
            delete question.id;
            if (oldCategoriesById[question.category]) {
              question.category = oldCategoriesById[question.category].order;
            }
          });
        } else {
          if (published) {
            await versionControlService.publishVersion(id, true, { transacting });
          }
          questionBank = await table.questionsBanks.update({ id }, props, { transacting });
        }
      } else {
        const version = await versionControlService.register('question-bank', {
          published,
          transacting,
        });
        questionBank = await table.questionsBanks.create(
          { id: version.fullId, ...props },
          { transacting }
        );
      }

      // -- Asset ---

      if (props.name) {
        const assetsToSave = {
          indexable: true,
          public: true, // TODO Cambiar a false despues de hacer la demo
          category: 'tests-questions-banks',
        };
        assetsToSave.name = props.name;
        if (props.description) assetsToSave.description = props.description;
        if (props.tagline) assetsToSave.tagline = props.tagline;
        if (props.color) assetsToSave.color = props.color;
        if (props.cover) assetsToSave.cover = props.cover;
        if (tags) assetsToSave.tags = tags;
        const assetService = leemons.getPlugin('leebrary').services.assets;

        if (id) {
          const q = await table.questionsBanks.findOne({ id }, { columns: ['asset'], transacting });
          // -- Asset update
          assetsToSave.id = q.asset;

          const asset = await assetService.update(assetsToSave, {
            upgrade: true,
            published,
            userSession,
            transacting,
          });

          questionBank = await table.questionsBanks.update(
            { id: questionBank.id },
            { asset: asset.id },
            { transacting }
          );
        } else {
          // -- Asset create
          const asset = await assetService.add(assetsToSave, {
            published,
            userSession,
            transacting,
          });
          questionBank = await table.questionsBanks.update(
            { id: questionBank.id },
            { asset: asset.id },
            { transacting }
          );
        }
      }

      // -- Subjects --
      await removeSubjectsFromQuestionBanks(questionBank.id, { transacting });
      if (_.isArray(subjects) && subjects.length > 0) {
        await addSubjectsToQuestionBanks(subjects, questionBank.id, { transacting });
      }

      // -- Tags --
      await tagsService.setTagsToValues(
        `plugins.tests.questionBanks`,
        tags || [],
        questionBank.id,
        {
          transacting,
        }
      );

      const [currentCategories, currentQuestions] = await Promise.all([
        table.questionBankCategories.find(
          { questionBank: questionBank.id },
          {
            columns: ['id'],
            transacting,
          }
        ),
        table.questions.find(
          { questionBank: questionBank.id },
          {
            columns: ['id'],
            transacting,
          }
        ),
      ]);
      // -- Categories --
      const currentCategoriesIds = _.map(currentCategories, 'id');
      const categoriesToCreate = [];
      const categoriesToUpdate = [];
      const categoriesToDelete = [];
      _.forEach(categories, (category, order) => {
        if (category.id) {
          if (currentCategoriesIds.includes(category.id)) {
            categoriesToUpdate.push({ ...category, order });
          } else {
            categoriesToCreate.push({ ...category, order });
          }
        } else if (category.value) {
          categoriesToCreate.push({ ...category, order });
        }
      });
      _.forEach(currentCategoriesIds, (categoryId) => {
        if (!_.find(categories, { id: categoryId })) {
          categoriesToDelete.push(categoryId);
        }
      });
      if (categoriesToDelete.length) {
        await Promise.all([
          table.questionBankCategories.deleteMany({ id_$in: categoriesToDelete }, { transacting }),
          table.questions.updateMany(
            { category_$in: categoriesToDelete },
            { category: null },
            { transacting }
          ),
        ]);
      }
      if (categoriesToUpdate.length) {
        await Promise.all(
          _.map(categoriesToUpdate, (question) =>
            updateCategory(
              {
                id: question.id,
                category: question.value,
                order: question.order,
              },
              { transacting }
            )
          )
        );
      }
      if (categoriesToCreate.length) {
        await Promise.all(
          _.map(categoriesToCreate, (question) =>
            createCategory(
              { category: question.value, order: question.order, questionBank: questionBank.id },
              { transacting }
            )
          )
        );
      }

      let orderedCategories = await table.questionBankCategories.find(
        { questionBank: questionBank.id },
        { transacting }
      );
      orderedCategories = _.orderBy(orderedCategories, ['order']);

      // -- Questions --
      const currentQuestionsIds = _.map(currentQuestions, 'id');
      const questionsToCreate = [];
      const questionsToUpdate = [];
      const questionsToDelete = [];
      _.forEach(questions, (question) => {
        if (question.id) {
          if (currentQuestionsIds.includes(question.id)) {
            questionsToUpdate.push(question);
          } else {
            questionsToCreate.push(question);
          }
        } else {
          questionsToCreate.push(question);
        }
      });

      _.forEach(currentQuestionsIds, (questionId) => {
        if (!_.find(questions, { id: questionId })) {
          questionsToDelete.push(questionId);
        }
      });

      if (questionsToDelete.length) {
        await deleteQuestions(questionsToDelete, { userSession, transacting });
      }

      if (questionsToUpdate.length) {
        await Promise.all(
          _.map(questionsToUpdate, (question) =>
            updateQuestion(
              {
                ...question,
                category:
                  // eslint-disable-next-line no-nested-ternary
                  _.isNumber(question.category) && question.category >= 0
                    ? orderedCategories[question.category].id
                    : _.isString(question.category)
                    ? question.category
                    : null,
              },
              {
                published,
                userSession,
                transacting,
              }
            )
          )
        );
      }

      if (questionsToCreate.length) {
        await Promise.all(
          _.map(questionsToCreate, (question) =>
            createQuestion(
              {
                ...question,
                questionBank: questionBank.id,
                category:
                  // eslint-disable-next-line no-nested-ternary
                  _.isNumber(question.category) && question.category >= 0
                    ? orderedCategories[question.category].id
                    : _.isString(question.category)
                    ? question.category
                    : null,
              },
              {
                published,
                userSession,
                transacting,
              }
            )
          )
        );
      }

      return questionBank;
    },
    table.questionsBanks,
    _transacting
  );
}

module.exports = { saveQuestionsBanks };
