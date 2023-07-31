const _ = require('lodash');
const { table } = require('../../tables');

async function duplicateByClass(
  classIds,
  { duplications: dup = {}, transacting: _transacting } = {}
) {
  const duplications = dup;
  return global.utils.withTransaction(
    async (transacting) => {
      const classSubstages = await table.classSubstage.find(
        { class_$in: _.isArray(classIds) ? classIds : [classIds] },
        { transacting }
      );
      await leemons.events.emit('before-duplicate-classes-substages', {
        classSubstages,
        transacting,
      });

      // ES: Empezamos la duplicación de los items
      // EN: Start the duplication of the items
      const newItems = await Promise.all(
        _.map(classSubstages, ({ id, ...item }) =>
          table.classSubstage.create(
            {
              ...item,
              class:
                duplications.classes && duplications.classes[item.class]
                  ? duplications.classes[item.class].id
                  : item.class,
              substage:
                duplications.substages && duplications.substages[item.substage]
                  ? duplications.substages[item.substage].id
                  : item.substage,
            },
            { transacting }
          )
        )
      );

      // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
      // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
      if (!_.isObject(duplications.classSubstages)) duplications.classSubstages = {};
      _.forEach(classSubstages, ({ id }, index) => {
        duplications.classSubstages[id] = newItems[index];
      });

      await leemons.events.emit('after-duplicate-classes-substages', {
        classSubstages,
        duplications: duplications.classSubstages,
        transacting,
      });
      return duplications;
    },
    table.classSubstage,
    _transacting
  );
}

module.exports = { duplicateByClass };
