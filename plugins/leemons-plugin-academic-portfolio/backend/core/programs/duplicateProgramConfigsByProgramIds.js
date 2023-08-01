const _ = require('lodash');
const { table } = require('../tables');

async function duplicateProgramConfigsByProgramIds(
  programIds,
  { duplications: dup = {}, transacting: _transacting } = {}
) {
  const duplications = dup;
  return global.utils.withTransaction(
    async (transacting) => {
      const configs = await table.configs.find(
        {
          $or: _.map(_.isArray(programIds) ? programIds : [programIds], (programId) => ({
            key_$startsWith: `program-${programId}`,
          })),
        },
        { transacting }
      );
      await leemons.events.emit('before-duplicate-program-configs', {
        configs,
        transacting,
      });

      // ES: Empezamos la duplicación de los items
      // EN: Start the duplication of the items
      const newConfigs = await Promise.all(
        _.map(configs, ({ id, ...item }) => {
          let key = item.key.split('course');
          if (duplications.programs) {
            _.forIn(duplications.programs, (value, oldID) => {
              key[0] = key[0].replace(oldID, value.id);
            });
          }
          if (duplications.courses && key[1]) {
            _.forIn(duplications.courses, (value, oldID) => {
              key[1] = key[1].replace(oldID, value.id);
            });
          }
          key = key.join('course');

          return table.configs.create(
            {
              ...item,
              key,
            },
            { transacting }
          );
        })
      );

      // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
      // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
      if (!_.isObject(duplications.configs)) duplications.configs = {};
      _.forEach(configs, ({ id }, index) => {
        duplications.configs[id] = newConfigs[index];
      });

      await leemons.events.emit('after-duplicate-program-configs', {
        configs,
        duplications: duplications.configs,
        transacting,
      });
      return true;
    },
    table.configs,
    _transacting
  );
}

module.exports = { duplicateProgramConfigsByProgramIds };
