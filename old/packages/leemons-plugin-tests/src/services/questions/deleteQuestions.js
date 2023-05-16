const _ = require('lodash');
const { table } = require('../tables');

async function deleteQuestions(questionId, { userSession, transacting: _transacting } = {}) {
  const questionIds = _.isArray(questionId) ? questionId : [questionId];
  const tagsService = leemons.getPlugin('common').services.tags;
  return global.utils.withTransaction(
    async (transacting) => {
      const questions = await table.questions.find({ id_$in: questionIds }, { transacting });

      const assetIds = [];
      _.forEach(questions, (question) => {
        // eslint-disable-next-line no-param-reassign
        question.properties = JSON.parse(question.properties);
        if (question.properties?.image) {
          assetIds.push(question.properties.image);
        }
      });

      // TODO: Añadir borrado de assets
      await Promise.all([
        table.questions.deleteMany({ id_$in: questionIds }, { transacting }),
        tagsService.removeAllTagsForValues('plugins.tests.questionBanks', questionIds, {
          transacting,
        }),
      ]);

      return true;
    },
    table.questions,
    _transacting
  );
}

module.exports = { deleteQuestions };
