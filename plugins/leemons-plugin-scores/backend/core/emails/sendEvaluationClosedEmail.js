const { keyBy } = require('lodash');

async function sendEvaluationClosedEmail({ scores, ctx }) {
  const periodId = scores[0].period;
  const classId = scores[0].class;
  const studentIds = scores.map((score) => score.student);

  const classData = await ctx.tx.call('academic-portfolio.classes.classByIds', {
    ids: [classId],
    withProgram: true,
  });

  const programId = classData[0].program.id;
  const periodData = classData[0].program.substages.find((s) => s.id === periodId);

  const [evaluationSystem, subjectIconUrl, userAgentsInfo, hostname] = await Promise.all([
    ctx.tx.call('academic-portfolio.programs.getProgramEvaluationSystem', {
      id: programId,
    }),
    ctx.tx.call('leebrary.assets.getCoverUrl', {
      assetId: classData[0].subject.icon.id,
    }),
    ctx.tx
      .call('users.users.getUserAgentsInfo', {
        userAgentIds: studentIds,
        userColumns: ['id', 'locale', 'email'],
      })
      .then((res) => keyBy(res, 'id')),
    ctx.tx.call('users.platform.getHostname'),
  ]);

  const promises = scores.map((score) => {
    const scale = evaluationSystem.scales.find((s) => s.number === score.grade);

    const locale = userAgentsInfo[score.student].user.locale;

    const context = {
      date: new Date().toLocaleDateString(locale, {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      }),

      periodName: periodData.name,
      subjectName: classData[0].subject.name,
      subjectIconUrl: subjectIconUrl ?? null,
      subjectColor: classData[0].subject.color ?? null,

      gradeLetter: scale.letter ?? null,
      gradeInt: !scale.letter ? Math.floor(scale.number).toString() : null,
      gradeDecimals:
        !scale.letter && scale.number % 1 !== 0
          ? Math.round((scale.number - Math.floor(scale.number)) * 100).toString()
          : null,
      gradeLabel: scale.description,

      evaluationUrl: `${hostname}/private/scores/scores`,
      preferencesUrl: `${hostname}/private/emails/preference`,
    };

    return ctx.tx.call('emails.email.sendAsEducationalCenter', {
      to: userAgentsInfo[score.student].user.email,
      templateName: 'evaluation-closed',
      language: locale,
      context,
      centerId: classData[0].program.centers[0].id,
    });
  });

  return Promise.all(promises);
}

module.exports = { sendEvaluationClosedEmail };
