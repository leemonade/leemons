const { uniqBy } = require('lodash');

async function getTeachersOfGivenClasses({ classes, ctx }) {
  const userAgentId = ctx.meta.userSession.userAgents[0].id;

  const classesData = await ctx.tx.call('academic-portfolio.classes.classByIds', {
    ids: classes,
  });

  return uniqBy(
    classesData
      .flatMap((classData) => classData.teachers)
      .filter((teacher) => teacher.type !== 'invited-teacher' || teacher.teacher === userAgentId),
    'teacher'
  );
}

module.exports = { getTeachersOfGivenClasses };
