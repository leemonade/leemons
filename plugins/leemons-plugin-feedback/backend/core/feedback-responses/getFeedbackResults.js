const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');

async function getFeedbackResults({ id, ctx }) {
  const [permissions, instance] = await Promise.all([
    ctx.tx.call('assignables.assignableInstances.getUserPermission', { assignableInstance: id }),
    ctx.tx.call('assignables.assignableInstances.getAssignableInstance', { id }),
  ]);

  if (
    !permissions.actions.includes('edit') &&
    (!permissions.actions.includes('view') ||
      (permissions.actions.includes('view') && !instance.showResults))
  ) {
    throw new LeemonsError(ctx, {
      message: 'You dont have permissions',
      httpStatusCode: 400,
      customCode: 6001,
    });
  }

  const [feedbackDates, feedbackResponses] = await Promise.all([
    ctx.tx.db.FeedbackDates.find({ instance: id }).lean(),
    ctx.tx.db.FeedbackResponse.find({ instance: id }).lean(),
  ]);

  // General info of feedback
  let numberOfStartedFeedback = 0;
  let numberOfFinishedFeedback = 0;
  feedbackDates.forEach(({ startDate, endDate }) => {
    if (startDate) numberOfStartedFeedback++;
    if (endDate) numberOfFinishedFeedback++;
  });

  const completionPercentage = Math.trunc((numberOfFinishedFeedback / feedbackDates.length) * 100);

  let totalTimeToFinishOfFeedback = 0;
  feedbackDates.forEach(({ timeToFinish }) => {
    if (timeToFinish) totalTimeToFinishOfFeedback += timeToFinish;
  });
  const avgTimeOfCompletion = totalTimeToFinishOfFeedback / numberOfFinishedFeedback;

  const feedbackGeneralInfo = {
    started: numberOfStartedFeedback,
    finished: numberOfFinishedFeedback,
    completionPercentage,
    avgTimeOfCompletion,
  };

  // Info of responses
  const questionResponses = _.groupBy(
    _.map(feedbackResponses, (value) => ({
      ...value,
      response: JSON.parse(value.response),
    })),
    'question'
  );
  const questions = await ctx.tx.db.FeedbackQuestions.find({
    id: Object.keys(questionResponses),
  }).lean();

  const questionsInfo = {};
  _.forEach(questions, (question) => {
    questionsInfo[question.id] = {
      value: {},
      percentages: {},
      totalValues: 0,
    };
    if (question.type === 'openResponse') {
      questionsInfo[question.id].value = [];
    } else {
      questionsInfo[question.id].avg = 0;
    }
    _.forEach(questionResponses[question.id], (questionResponse) => {
      if (question.type === 'openResponse') {
        questionsInfo[question.id].value.push(questionResponse.response);
        questionsInfo[question.id].totalValues++;
      }
      if (
        question.type === 'singleResponse' ||
        question.type === 'likertScale' ||
        question.type === 'netPromoterScore'
      ) {
        if (!questionsInfo[question.id].value[questionResponse.response]) {
          questionsInfo[question.id].value[questionResponse.response] = 0;
        }
        questionsInfo[question.id].avg += questionResponse.response;
        questionsInfo[question.id].value[questionResponse.response]++;
        questionsInfo[question.id].totalValues++;
      }
      if (question.type === 'multiResponse') {
        _.forEach(questionResponse.response, (response) => {
          if (!questionsInfo[question.id].value[response]) {
            questionsInfo[question.id].value[response] = 0;
          }
          questionsInfo[question.id].avg += response;
          questionsInfo[question.id].value[response]++;
          questionsInfo[question.id].totalValues++;
        });
      }
    });

    if (question.type !== 'openResponse') {
      questionsInfo[question.id].avg /= questionsInfo[question.id].totalValues;
      if (question.type === 'likertScale') {
        questionsInfo[question.id].avg += 1;
      }
      _.forIn(questionsInfo[question.id].value, (value, key) => {
        questionsInfo[question.id].percentages[key] =
          (value / questionsInfo[question.id].totalValues) * 100;
      });
    }

    if (question.type === 'netPromoterScore') {
      let detractors = 0;
      let passives = 0;
      let promoters = 0;
      if (questionsInfo[question.id].value[0]) {
        detractors += questionsInfo[question.id].value[0];
      }
      if (questionsInfo[question.id].value[1]) {
        detractors += questionsInfo[question.id].value[1];
      }
      if (questionsInfo[question.id].value[2]) {
        detractors += questionsInfo[question.id].value[2];
      }
      if (questionsInfo[question.id].value[3]) {
        detractors += questionsInfo[question.id].value[3];
      }
      if (questionsInfo[question.id].value[4]) {
        detractors += questionsInfo[question.id].value[4];
      }
      if (questionsInfo[question.id].value[5]) {
        detractors += questionsInfo[question.id].value[5];
      }
      if (questionsInfo[question.id].value[6]) {
        detractors += questionsInfo[question.id].value[6];
      }
      if (questionsInfo[question.id].value[7]) {
        passives += questionsInfo[question.id].value[7];
      }
      if (questionsInfo[question.id].value[8]) {
        passives += questionsInfo[question.id].value[8];
      }
      if (questionsInfo[question.id].value[9]) {
        promoters += questionsInfo[question.id].value[9];
      }
      if (questionsInfo[question.id].value[10]) {
        promoters += questionsInfo[question.id].value[10];
      }
      const avgDetractors = (detractors / questionsInfo[question.id].totalValues) * 100;
      const avgPromoters = (promoters / questionsInfo[question.id].totalValues) * 100;
      questionsInfo[question.id].nps = {
        points: avgPromoters - avgDetractors,
        detractors: {
          number: detractors,
          avg: avgDetractors,
        },
        passives: {
          number: passives,
          avg: (passives / questionsInfo[question.id].totalValues) * 100,
        },
        promoters: {
          number: promoters,
          avg: avgPromoters,
        },
      };
    }
  });

  return { generalInfo: feedbackGeneralInfo, questionsInfo };
}

module.exports = getFeedbackResults;
