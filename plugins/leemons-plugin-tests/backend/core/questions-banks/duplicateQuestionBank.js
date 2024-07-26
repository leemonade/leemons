const { LeemonsError } = require('@leemons/error');

const { getQuestionsBanksDetails } = require('./getQuestionsBanksDetails');
const { saveQuestionsBanks } = require('./saveQuestionsBanks');
const { prepareQuestionForDuplication } = require('../questions/duplicateQuestion');

/**
 * Duplicates a question bank
 *
 * @param {object} params - Function parameters
 * @param {string} params.id - ID of the question bank to duplicate
 * @param {boolean} params.ignoreSubjects - Indicates whether to duplicate subject
 * @param {MoleculerContext} params.ctx - Moleculer context
 * @returns {Promise<import('./saveQuestionsBanks').QuestionBank>} - Object with the information of the duplicated question bank
 */
async function duplicateQuestionBank({ id, ignoreSubjects, ctx }) {
  const qBanks = await getQuestionsBanksDetails({ id, getAssets: true, ctx });
  if (!qBanks.length) {
    throw new LeemonsError(ctx, { message: 'Question bank not found' });
  }

  const [qBank] = qBanks;
  const subjects = ignoreSubjects ? [] : qBank.subjects?.map((subject) => subject.id);
  const categories = qBank.categories.map((category) => ({ value: category.value }));

  const transformed = {
    name: `${qBank.name} (1)`,
    tagline: qBank.tagline || null,
    description: qBank.description || null,
    color: qBank.color || null,
    cover: qBank.cover || null,
    state: qBank.state || null, // What is this? Not used in saveQuestionBanks or stored in db
    program: qBank.program || null,
    categories,
    subjects,
    tags: qBank.tags || [],
    published: true,
  };

  transformed.questions = qBank.questions.map(prepareQuestionForDuplication);

  return saveQuestionsBanks({ data: transformed, ctx });
}

module.exports = {
  duplicateQuestionBank,
};
