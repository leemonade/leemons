/* eslint-disable no-param-reassign */
const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');

const { validateSaveQuestionBank } = require('../../validations/forms');
const { createCategory } = require('../question-bank-categories/createCategory');
const { updateCategory } = require('../question-bank-categories/updateCategory');
const {
  addSubjectsToQuestionBanks,
} = require('../question-bank-subjects/addSubjectsToQuestionBanks');
const {
  removeSubjectsFromQuestionBanks,
} = require('../question-bank-subjects/removeSubjectsFromQuestionBanks');
const { createQuestion } = require('../questions/createQuestion');
const { deleteQuestions } = require('../questions/deleteQuestions');
const { updateQuestion } = require('../questions/updateQuestion');

const removeUnusedFields = (data, otherFields = []) =>
  _.omit(data, ['_id', '__v', 'deploymentID', 'isDeleted', ...otherFields]);

/**
 * @typedef {Object} QuestionBank
 * Represents a question bank object with associated details.
 *
 * @property {string} id - The unique identifier of the question bank.
 * @property {string} name - The name of the question bank.
 * @property {string} [description] - The description of the question bank.
 * @property {string} [tagline] - A brief tagline for the question bank.
 * @property {string} [color] - The color associated with the question bank.
 * @property {string} [cover] - The cover image URL or asset identifier for the question bank.
 * @property {boolean} published - Indicates whether the question bank is published.
 * @property {Array.<string>} [tags] - Tags associated with the question bank.
 * @property {Array.<string>} [subjects] - Subjects associated with the question bank.
 * @property {Array.<Category>} categories - Categories associated with the question bank.
 * @property {Array.<Question>} questions - Questions contained within the question bank.
 * @property {string} [asset] - The asset identifier linked to the question bank.
 * @property {string} [program] - The program associated with the question bank.
 * @property {Object} [version] - Version details if the question bank is version controlled.
 */

/**
 * @typedef {Object} Category
 * Represents a category within a question bank.
 *
 * @property {string} id - The unique identifier of the category.
 * @property {string} value - The name or value of the category.
 * @property {number} order - The display order of the category within the question bank.
 */

/**
 * @typedef {Object} Question
 * Represents a question within a question bank.
 *
 * @property {string} id - The unique identifier of the question.
 * @property {string} type - The type of the question (e.g., multiple choice, true/false).
 * @property {string} level - The difficulty level of the question.
 * @property {boolean} withImages - Indicates whether the question includes images.
 * @property {Array.<string>} tags - Tags associated with the question.
 * @property {string} [category] - The category this question belongs to.
 * @property {Object} properties - Additional properties specific to the question.
 */

/**
 * Saves a question bank by creating a new one or updating an existing one.
 *
 * @param {Object} params - The parameters for saving a question bank.
 * @param {Object} params.data - The question bank data to be saved.
 * @param {Object} params.ctx - The context object containing metadata and functions for database access and more.
 * @returns {Promise<QuestionBank>} The updated or newly created question bank object.
 * @throws {LeemonsError} If the user session is not provided.
 *
 * @description
 * This function handles several key operations:
 *
 * 1. Validation and Preparation: Validates the input data against a schema and prepares it by removing unused fields.
 * 2. Version Control: Manages version control for existing question banks, creating new versions if necessary.
 * 3. Asset Management: Handles the creation or updating of assets associated with the question bank.
 * 4. Subject, Category, and Tag Handling: Manages the subjects, categories, and tags associated with the question bank, including adding, updating, and removing as needed.
 * 5. Question Management: Updates, creates, or deletes questions within the question bank based on the provided data.
 * 6. Error Handling: Includes error handling to manage and report any issues during the process.
 *
 * After successfully processing, it returns the updated or newly created question bank object.
 */
async function saveQuestionsBanks({ data: _data, ctx }) {
  const { userSession } = ctx.meta;
  const data = removeUnusedFields(_.cloneDeep(_data), ['asset']);
  data.questions = _.map(data.questions, (question) =>
    removeUnusedFields(question, [
      'questionBank',
      'deleted',
      'created_at',
      'updated_at',
      'deleted_at',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ])
  );

  // Check is userSession is provided
  if (!userSession) {
    throw new LeemonsError(ctx, { message: 'User session is required (saveQuestionsBanks)' });
  }

  validateSaveQuestionBank(data, ctx);

  const { id, questions, categories, tags, published, subjects, ...props } = data;
  let questionBank;

  if (id) {
    let version = await ctx.tx.call('common.versionControl.getVersion', { id });

    if (version.published) {
      version = await ctx.tx.call('common.versionControl.upgradeVersion', {
        id,
        upgrade: 'major',
        published,
        setAsCurrent: !!published,
      });
      const _questionBankDoc = await ctx.tx.db.QuestionsBanks.create({
        id: version.fullId,
        published,
        ...props,
      });
      questionBank = _questionBankDoc.toObject();

      // ES - Borramos las id para que se creen nuevas
      // EN - Remove the id of each question for them to be created as new
      _.forEach(data.questions, (question) => {
        delete question.id;
        delete question._id;
      });
    } else {
      if (published) {
        await ctx.tx.call('common.versionControl.publishVersion', {
          id,
          publish: true,
          setAsCurrent: true,
        });
      }
      questionBank = await ctx.tx.db.QuestionsBanks.findOneAndUpdate(
        { id },
        { ...props, published },
        {
          lean: true,
          new: true,
        }
      );
    }
  } else {
    const version = await ctx.tx.call('common.versionControl.register', {
      type: 'question-bank',
      published,
      setAsCurrent: !!published,
    });
    questionBank = await ctx.tx.db.QuestionsBanks.create({
      id: version.fullId,
      published,
      ...props,
    });
    questionBank = questionBank.toObject();
  }

  // -- Asset ---

  if (props.name) {
    const assetsToSave = {
      indexable: true,
      public: true,
      category: 'tests-questions-banks',
    };
    assetsToSave.name = props.name;
    if (props.description) assetsToSave.description = props.description;
    if (props.tagline) assetsToSave.tagline = props.tagline;
    if (props.color) assetsToSave.color = props.color;
    if (props.cover) assetsToSave.cover = props.cover?.id ?? props.cover;
    if (tags) assetsToSave.tags = tags;
    if (data.program) assetsToSave.program = data.program;
    if (subjects) assetsToSave.subjects = subjects;

    if (id) {
      const q = await ctx.tx.db.QuestionsBanks.findOne({ id }).select(['asset']).lean();
      // -- Asset update --
      assetsToSave.id = q.asset;

      const asset = await ctx.tx.call('leebrary.assets.update', {
        data: assetsToSave,
        upgrade: true,
        published,
      });

      questionBank = await ctx.tx.db.QuestionsBanks.findOneAndUpdate(
        { id: questionBank.id },
        { asset: asset.id, published },
        { new: true, lean: true }
      );
    } else {
      // -- Asset create
      const asset = await ctx.tx.call('leebrary.assets.add', {
        asset: assetsToSave,
        published,
      });
      questionBank = await ctx.tx.db.QuestionsBanks.findOneAndUpdate(
        { id: questionBank.id },
        { asset: asset.id, published },
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
  _.forEach(categories, (category) => {
    if (category.id) {
      if (currentCategoriesIds.includes(category.id)) {
        categoriesToUpdate.push({ ...category });
      } else {
        categoriesToCreate.push({ ...category });
      }
    } else if (category.value) {
      categoriesToCreate.push({ ...category });
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
      _.map(categoriesToUpdate, ({ id, value, order }) =>
        updateCategory({
          data: {
            id,
            category: value,
            order,
          },
          ctx,
        })
      )
    );
  }
  if (categoriesToCreate.length) {
    await Promise.all(
      _.map(categoriesToCreate, ({ value, order }) =>
        createCategory({
          data: { category: value, order, questionBank: questionBank.id },
          ctx,
        })
      )
    );
  }

  const questionBankCategories = await ctx.tx.db.QuestionBankCategories.find({
    questionBank: questionBank.id,
  }).lean();

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
              questionBankCategories.find((category) => category.order === question.category)?.id ||
              null,
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
              questionBankCategories.find((category) => category.order === question.category)?.id ||
              null,
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
