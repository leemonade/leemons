const _ = require('lodash');
const { table } = require('../../tables');

async function duplicateByClass(
  classIds,
  { duplications: dup = {}, transacting: _transacting } = {}
) {
  const duplications = dup;
  return global.utils.withTransaction(
    async (transacting) => {
      const classGroups = await table.classGroup.find(
        { class_$in: _.isArray(classIds) ? classIds : [classIds] },
        { transacting }
      );
      await leemons.events.emit('before-duplicate-classes-courses', {
        classGroups,
        transacting,
      });

      // ES: Empezamos la duplicación de los items
      // EN: Start the duplication of the items
      const newItems = await Promise.all(
        _.map(classGroups, ({ id, ...item }) =>
          table.classGroup.create(
            {
              ...item,
              class:
                duplications.classes && duplications.classes[item.class]
                  ? duplications.classes[item.class].id
                  : item.class,
              group:
                duplications.groups && duplications.groups[item.group]
                  ? duplications.groups[item.group].id
                  : item.group,
            },
            { transacting }
          )
        )
      );

      // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
      // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
      if (!_.isObject(duplications.classGroups)) duplications.classGroups = {};
      _.forEach(classGroups, ({ id }, index) => {
        classGroups.classGroups[id] = newItems[index];
      });

      await leemons.events.emit('after-duplicate-classes-courses', {
        classGroups,
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
