const _ = require('lodash');
const { table } = require('../../tables');

async function duplicateByClass(
  classIds,
  { duplications: dup = {}, transacting: _transacting } = {}
) {
  const duplications = dup;
  return global.utils.withTransaction(
    async (transacting) => {
      const classCourses = await table.classCourse.find(
        { class_$in: _.isArray(classIds) ? classIds : [classIds] },
        { transacting }
      );
      await leemons.events.emit('before-duplicate-classes-courses', {
        classCourses,
        transacting,
      });

      // ES: Empezamos la duplicación de los items
      // EN: Start the duplication of the items
      const newItems = await Promise.all(
        _.map(classCourses, ({ id, ...item }) =>
          table.classCourse.create(
            {
              ...item,
              class:
                duplications.classes && duplications.classes[item.class]
                  ? duplications.classes[item.class].id
                  : item.class,
              course:
                duplications.courses && duplications.courses[item.course]
                  ? duplications.courses[item.course].id
                  : item.course,
            },
            { transacting }
          )
        )
      );

      // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
      // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
      if (!_.isObject(duplications.classCourses)) duplications.classCourses = {};
      _.forEach(classCourses, ({ id }, index) => {
        duplications.classCourses[id] = newItems[index];
      });

      await leemons.events.emit('after-duplicate-classes-courses', {
        classCourses,
        duplications: duplications.classCourses,
        transacting,
      });
      return duplications;
    },
    table.classCourse,
    _transacting
  );
}

module.exports = { duplicateByClass };
