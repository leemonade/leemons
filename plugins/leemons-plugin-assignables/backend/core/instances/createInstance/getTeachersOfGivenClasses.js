const { uniqBy } = require('lodash');

async function getTeachersOfGivenClasses({ classes, ctx }) {
  const classesData = await ctx.tx.call('academic-portfolio.classes.classByIds', {
    ids: classes,
  });

  return uniqBy(
    classesData.flatMap((classData) => classData.teachers),
    'teacher'
  );
}

module.exports = { getTeachersOfGivenClasses };
