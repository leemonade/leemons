const { uniqBy } = require('lodash');

async function getTeachersOfGivenClasses({ classes, ctx }) {
  const classesData = await ctx.tx.call('academic-portfolio.classes.classesByIds', {
    ids: classes,
  });

  const teachers = uniqBy(
    classesData.flatMap((classData) => classData.teachers),
    'teacher'
  );

  return teachers;
}

module.exports = { getTeachersOfGivenClasses };
