const _ = require('lodash');
const { table } = require('../tables');

async function duplicateCourseByIds(
  ids,
  { duplications: dup = {}, transacting: _transacting } = {}
) {
  const duplications = dup;
  return global.utils.withTransaction(
    async (transacting) => {
      const courses = await table.groups.find(
        { id_$in: _.isArray(ids) ? ids : [ids], type: 'course' },
        { transacting }
      );
      await leemons.events.emit('before-duplicate-courses', { courses, transacting });

      // ES: Empezamos la duplicación de los items
      // EN: Start the duplication of the items
      const newCourses = await Promise.all(
        _.map(courses, ({ id, ...item }) =>
          table.groups.create(
            {
              ...item,
              program:
                duplications.programs && duplications.programs[item.program]
                  ? duplications.programs[item.program].id
                  : item.program,
            },
            { transacting }
          )
        )
      );

      // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
      // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
      if (!_.isObject(duplications.courses)) duplications.courses = {};
      _.forEach(courses, ({ id }, index) => {
        duplications.courses[id] = newCourses[index];
      });

      await leemons.events.emit('after-duplicate-courses', {
        courses,
        duplications: duplications.courses,
        transacting,
      });
      return duplications;
    },
    table.groups,
    _transacting
  );
}

module.exports = { duplicateCourseByIds };
