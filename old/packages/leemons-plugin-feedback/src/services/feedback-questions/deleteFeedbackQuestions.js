const _ = require('lodash');
const { forEach, isString } = require('lodash');
const { table } = require('../tables');

async function deleteFeedbackQuestions(
  questionId,
  { userSession, transacting: _transacting } = {}
) {
  const questionIds = _.isArray(questionId) ? questionId : [questionId];
  return global.utils.withTransaction(
    async (transacting) => {
      const questions = await table.feedbackQuestions.find(
        { id_$in: questionIds },
        { transacting }
      );

      const assetIds = [];
      _.forEach(questions, (question) => {
        // eslint-disable-next-line no-param-reassign
        question.properties = JSON.parse(question.properties);
        if (question.properties.responses) {
          forEach(question.properties.responses, (response) => {
            if (response.value.image && !isString(response.value.image)) {
              assetIds.push(response.value.image);
            }
          });
        }
      });

      if (assetIds.length) {
        await Promise.all(
          _.map(assetIds, (r) =>
            leemons.getPlugin('leebrary').services.assets.remove(r, {
              userSession,
              transacting,
            })
          )
        );
      }
      await table.feedbackQuestions.deleteMany({ id_$in: questionIds }, { transacting });

      return true;
    },
    table.feedbackQuestions,
    _transacting
  );
}

module.exports = { deleteFeedbackQuestions };
