const _ = require('lodash');
const { table } = require('../../tables');

async function duplicateByClass(
  classIds,
  { duplications: dup = {}, transacting: _transacting } = {}
) {
  const duplications = dup;
  return global.utils.withTransaction(
    async (transacting) => {
      const classStudents = await table.classStudent.find(
        { class_$in: _.isArray(classIds) ? classIds : [classIds] },
        { transacting }
      );
      await leemons.events.emit('before-duplicate-classes-students', {
        classStudents,
        transacting,
      });

      // ES: Empezamos la duplicación de los items
      // EN: Start the duplication of the items
      const newItems = await Promise.all(
        _.map(classStudents, ({ id, ...item }) =>
          table.classStudent.create(
            {
              ...item,
              class:
                duplications.classes && duplications.classes[item.class]
                  ? duplications.classes[item.class].id
                  : item.class,
            },
            { transacting }
          )
        )
      );

      // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
      // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
      if (!_.isObject(duplications.classStudents)) duplications.classStudents = {};
      _.forEach(classStudents, ({ id }, index) => {
        duplications.classStudents[id] = newItems[index];
      });

      await leemons.events.emit('after-duplicate-classes-students', {
        classStudents,
        duplications: duplications.classStudents,
        transacting,
      });
      return duplications;
    },
    table.classStudent,
    _transacting
  );
}

module.exports = { duplicateByClass };
