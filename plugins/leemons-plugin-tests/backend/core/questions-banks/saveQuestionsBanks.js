/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
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

async function saveQuestionsBanks({ data: _data, ctx }) {
  const { userSession } = ctx.meta;
  const data = _.cloneDeep(_data);
  delete data.asset;
  _.forEach(data.questions, (question) => {
    delete question.questionBank;
    delete question.deleted;
    delete question.created_at;
    delete question.updated_at;
    delete question.deleted_at;
    delete question.createdAt;
    delete question.updatedAt;
    delete question.deletedAt;
  });
  // Check is userSession is provided
  if (!userSession)
    throw new LeemonsError(ctx, { message: 'User session is required (saveQuestionsBanks)' });
  validateSaveQuestionBank(data);
  const { id, questions, categories, tags, published, subjects, ...props } = data;
  let questionBank;

  if (id) {
    let version = await ctx.tx.call('common.versionControl.getVersion', { id });

    if (version.published) {
      version = await ctx.tx.call('common.versionControl.upgradeVersion', {
        id,
        upgrade: 'major',
        published,
        setAsCurrent: true,
      });
      const [_questionBank, oldCategories] = await Promise.all([
        ctx.tx.db.QuestionsBanks.create({ id: version.fullId, ...props }).then((r) => r.toObject()),
        ctx.tx.db.QuestionBankCategories.find({ questionBank: id }).lean(),
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
        await ctx.tx.call('common.versionControl.publishVersion', {
          id,
          publish: true,
        });
      }
      questionBank = await ctx.tx.db.QuestionsBanks.findOneAndUpdate({ id }, props, {
        lean: true,
        new: true,
      });
    }
  } else {
    const version = await ctx.tx.call('common.versionControl.register', {
      type: 'question-bank',
      published,
    });
    questionBank = await ctx.tx.db.QuestionsBanks.create({ id: version.fullId, ...props });
    questionBank = questionBank.toObject();
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

    if (id) {
      const q = await ctx.tx.db.QuestionsBanks.findOne({ id }).select(['asset']).lean();
      // -- Asset update
      assetsToSave.id = q.asset;

      const asset = await ctx.tx.call('leebrary.assets.update', {
        data: assetsToSave,
        upgrade: true,
        published,
      });

      questionBank = await ctx.tx.db.QuestionsBanks.findOneAndUpdate(
        { id: questionBank.id },
        { asset: asset.id },
        { new: true, lean: true }
      );
    } else {
      // -- Asset create
      const asset = await ctx.tx.call('leebrary.assets.add', {
        asset: assetsToSave,
        options: { published },
      });
      questionBank = await ctx.tx.db.QuestionsBanks.findOneAndUpdate(
        { id: questionBank.id },
        { asset: asset.id },
        { new: true, lean: true }
      );
    }
  }

  // -- Subjects --
  await removeSubjectsFromQuestionBanks({ questionBank: questionBank.id, ctx });
  if (_.isArray(subjects) && subjects.length > 0) {
    await addSubjectsToQuestionBanks({ subject: subjects, questionBank: questionBank.id, ctx });
  }

  // -- Tags --
  await ctx.tx.call('common.tags.setTagsToValues', {
    type: `tests.questionBanks`,
    tags: tags || [],
    values: questionBank.id,
  });

  const [currentCategories, currentQuestions] = await Promise.all([
    ctx.tx.db.QuestionBankCategories.find({ questionBank: questionBank.id }).select(['id']).lean(),
    ctx.tx.db.Questions.find({ questionBank: questionBank.id }).select(['id']).lean(),
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
      ctx.tx.db.QuestionBankCategories.deleteMany({ id: categoriesToDelete }),
      ctx.tx.db.Questions.updateMany({ category: categoriesToDelete }, { category: null }),
    ]);
  }
  if (categoriesToUpdate.length) {
    await Promise.all(
      _.map(categoriesToUpdate, (question) =>
        updateCategory({
          data: {
            id: question.id,
            category: question.value,
            order: question.order,
          },
          ctx,
        })
      )
    );
  }
  if (categoriesToCreate.length) {
    await Promise.all(
      _.map(categoriesToCreate, (question) =>
        createCategory({
          data: { category: question.value, order: question.order, questionBank: questionBank.id },
          ctx,
        })
      )
    );
  }

  let orderedCategories = await ctx.tx.db.QuestionBankCategories.find({
    questionBank: questionBank.id,
  }).lean();
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
    await deleteQuestions({ questionId: questionsToDelete, ctx });
  }

  if (questionsToUpdate.length) {
    await Promise.all(
      _.map(questionsToUpdate, (question) =>
        updateQuestion({
          data: {
            ...question,
            category:
              // eslint-disable-next-line no-nested-ternary
              _.isNumber(question.category) && question.category >= 0
                ? orderedCategories[question.category].id
                : _.isString(question.category)
                ? question.category
                : null,
          },
          published,
          ctx,
        })
      )
    );
  }

  if (questionsToCreate.length) {
    await Promise.all(
      _.map(questionsToCreate, (question) =>
        createQuestion({
          data: {
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
          published,
          ctx,
        })
      )
    );
  }

  return questionBank;
}

module.exports = { saveQuestionsBanks };
