const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getByIds } = require('../questions');

/**
 * @typedef {Object} QuestionBankDetails
 * @property {string} id - The unique identifier of the question bank.
 * @property {string} name - The name of the question bank.
 * @property {string} description - A description of the question bank.
 * @property {string} color - The color associated with the question bank.
 * @property {string|null} cover - The cover image or asset identifier for the question bank.
 * @property {Array<string>} tags - Tags associated with the question bank.
 * @property {Array<Object>} questions - A list of questions associated with the question bank. Each question object contains properties: id (string), question (string), type (string), and level (string|null).
 * @property {Array<Object>} subjects - Subjects associated with the question bank. Each subject object contains properties: id (string), name (string).
 * @property {Array<Object>} categories - Categories associated with the question bank. Each category object contains properties: id (string), value (string).
 * @property {Array<Object>|null} assets - Assets associated with the question bank, if any. Each asset object contains properties: id (string), url (string).
 */

/**
 * Retrieves detailed information about question banks by their IDs.
 *
 * @param {Object} params - The parameters for fetching question bank details.
 * @param {string|string[]} params.id - A single ID or an array of IDs of the question banks to retrieve.
 * @param {boolean} [params.getAssets=true] - Whether to include related assets in the response.
 * @param {Object} params.ctx - The context object containing database and session information.
 * @returns {Promise<QuestionBankDetails[]>} A promise that resolves to an array of question bank details.
 * @throws {LeemonsError} If `getAssets` is true and no user session is provided.
 *
 * @description
 * This function performs several key operations:
 * 1. User Session Check: Verifies if a user session is provided and throws an error if required but missing.
 * 2. Identifiers Handling: Normalizes the input `id` to an array of IDs to handle both single and multiple identifiers.
 * 3. Fetching Question Banks: Queries the database for question banks matching the provided IDs or associated assets, including those marked as deleted.
 * 4. Aggregating Related Data: Gathers related data in parallel operations, including:
 *    - Questions associated with the question banks.
 *    - Subjects and categories related to the question banks.
 *    - Optionally, related assets if `getAssets` is true, using the `leebrary.assets.getByIds` service.
 * 5. Tagging and Asset Inclusion: Prepares tags for the question banks and decides whether to include asset details based on the `getAssets` flag.
 */
async function getQuestionsBanksDetails({ id, getAssets = true, ctx }) {
  const { userSession } = ctx.meta;
  // Check is userSession is provided
  if (getAssets && !userSession)
    throw new LeemonsError(ctx, { message: 'User session is required (getQuestionsBanksDetails)' });

  const ids = _.isArray(id) ? id : [id];
  const questionsBanks = await ctx.tx.db.QuestionsBanks.find(
    { $or: [{ id: ids }, { asset: ids }] },
    undefined,
    { excludeDeleted: false }
  ).lean();

  const questionBankIds = _.map(questionsBanks, 'id');
  const questionIds = await ctx.tx.db.Questions.find({ questionBank: questionBankIds })
    .select(['id'])
    .lean();
  const [questions, questionBankSubjects, questionBankCategories] = await Promise.all([
    getByIds({ id: _.map(questionIds, 'id'), ctx }),
    ctx.tx.db.QuestionBankSubjects.find({ questionBank: questionBankIds }).lean(),
    ctx.tx.db.QuestionBankCategories.find({ questionBank: questionBankIds }).lean(),
  ]);

  const promises = [];
  if (questionsBanks.length) {
    promises.push(
      ctx.tx.call('common.tags.getValuesTags', {
        type: 'tests.questionBanks',
        values: _.map(questionsBanks, 'id'),
      })
    );

    if (getAssets) {
      promises.push(
        ctx.tx.call('leebrary.assets.getByIds', {
          ids: _.map(questionsBanks, 'asset'),
          withFiles: true,
        })
      );
    } else {
      promises.push(Promise.resolve([]));
    }
  } else {
    promises.push(Promise.resolve([]));
    promises.push(Promise.resolve([]));
  }

  const [questionBanksTags, questionBanksAssets] = await Promise.all(promises);

  _.forEach(questionsBanks, (qBank, i) => {
    const questionBank = questionsBanks[i];
    questionBank.tags = questionBanksTags[i];
    if (questionBanksAssets[i]) {
      questionBank.asset = questionBanksAssets[i];
      questionBank.tagline = questionBanksAssets[i].tagline;
      questionBank.description = questionBanksAssets[i].description;
      questionBank.color = questionBanksAssets[i].color;
      questionBank.file = questionBanksAssets[i].file;
      questionBank.tags = questionBanksAssets[i].tags;
      questionBank.cover = questionBanksAssets[i].cover;
    }
  });

  const questionBankCategoriesByQuestionBank = _.groupBy(questionBankCategories, 'questionBank');
  const questionBankSubjectsByQuestionBank = _.groupBy(questionBankSubjects, 'questionBank');
  const questionsByQuestionBank = _.groupBy(questions, 'questionBank');

  return _.map(questionsBanks, (questionBank) => {
    const categories = _.orderBy(questionBankCategoriesByQuestionBank[questionBank.id], ['order']);
    const questionCategories = {};
    _.forEach(categories, (category, index) => {
      questionCategories[category.id] = index;
    });
    return {
      ...questionBank,
      categories: _.map(categories, (item) => ({
        value: item.category,
        id: item.id,
      })),
      subjects: _.map(questionBankSubjectsByQuestionBank[questionBank.id], 'subject'),
      questions: _.map(questionsByQuestionBank[questionBank.id] || [], (question) => ({
        ...question,
      })),
    };
  });
}

module.exports = { getQuestionsBanksDetails };
