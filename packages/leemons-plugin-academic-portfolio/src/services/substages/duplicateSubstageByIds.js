const _ = require('lodash');
const { table } = require('../tables');

async function duplicateSubstageByIds(
  ids,
  { duplications: dup = {}, transacting: _transacting } = {}
) {
  const duplications = dup;
  return global.utils.withTransaction(
    async (transacting) => {
      const substages = await table.groups.find(
        { id_$in: _.isArray(ids) ? ids : [ids], type: 'substage' },
        { transacting }
      );
      await leemons.events.emit('before-duplicate-substages', { substages, transacting });

      // ES: Empezamos la duplicación de los items
      // EN: Start the duplication of the items
      const newSubstages = await Promise.all(
        _.map(substages, ({ id, ...item }) =>
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
      if (!_.isObject(duplications.substages)) duplications.substages = {};
      _.forEach(substages, ({ id }, index) => {
        duplications.substages[id] = newSubstages[index];
      });

      await leemons.events.emit('after-duplicate-substages', {
        substages,
        duplications: duplications.substages,
        transacting,
      });
      return duplications;
    },
    table.groups,
    _transacting
  );
}

module.exports = { duplicateSubstageByIds };
