const _ = require('lodash');

async function duplicateCourseByIds({ ids, duplications: dup = {}, ctx }) {
  const duplications = dup;
  const courses = await ctx.tx.db.Groups.find({
    id: _.isArray(ids) ? ids : [ids],
    type: 'course',
  }).lean();
  await ctx.tx.emit('before-duplicate-courses', { courses });

  // ES: Empezamos la duplicación de los items
  // EN: Start the duplication of the items
  const newCourses = await Promise.all(
    _.map(courses, ({ id, ...item }) =>
      ctx.tx.db.Groups.create({
        ...item,
        program:
          duplications.programs && duplications.programs[item.program]
            ? duplications.programs[item.program].id
            : item.program,
      })
    )
  );

  // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
  // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
  if (!_.isObject(duplications.courses)) duplications.courses = {};
  _.forEach(courses, ({ id }, index) => {
    duplications.courses[id] = newCourses[index];
  });

  await ctx.tx.emit('after-duplicate-courses', {
    courses,
    duplications: duplications.courses,
  });
  return duplications;
}

module.exports = { duplicateCourseByIds };
