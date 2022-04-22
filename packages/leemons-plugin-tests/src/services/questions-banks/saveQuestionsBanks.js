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

async function saveQuestionsBanks(_data, { transacting: _transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  const versionControlService = leemons.getPlugin('common').services.versionControl;
  return global.utils.withTransaction(
    async (transacting) => {
      const data = _.cloneDeep(_data);
      _.forEach(data.questions, (question) => {
        delete question.questionBank;
        delete question.deleted;
        delete question.created_at;
        delete question.updated_at;
        delete question.deleted_at;
      });
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
          questionBank = await table.questionsBanks.create(
            { id: version.fullId, ...props },
            { transacting }
          );
          // ES - Borramos las id para que se creen nuevas
          // EN - Delete the id to create new
          _.forEach(data.questions, (question) => {
            delete question.id;
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

      await removeSubjectsFromQuestionBanks(questionBank.id, { transacting });
      if (_.isArray(subjects) && subjects.length > 0) {
        await addSubjectsToQuestionBanks(subjects, questionBank.id, { transacting });
      }

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
        } else {
          categoriesToCreate.push({ ...category, order });
        }
      });
      _.forEach(currentCategoriesIds, (categoryId) => {
        if (!_.find(categories, { id: categoryId })) {
          categoriesToDelete.push(categoryId);
        }
      });
      if (categoriesToDelete.length) {
        await table.questionBankCategories.deleteMany(
          { id_$in: categoriesToDelete },
          { transacting }
        );
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
        await table.questions.deleteMany({ id_$in: questionsToDelete }, { transacting });
      }
      if (questionsToUpdate.length) {
        await Promise.all(
          _.map(questionsToUpdate, (question) => updateQuestion(question, { transacting }))
        );
      }
      if (questionsToCreate.length) {
        await Promise.all(
          _.map(questionsToCreate, (question) =>
            createQuestion({ ...question, questionBank: questionBank.id }, { transacting })
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
