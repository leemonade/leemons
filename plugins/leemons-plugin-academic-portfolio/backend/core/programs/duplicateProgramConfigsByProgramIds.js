const _ = require('lodash');

async function duplicateProgramConfigsByProgramIds({ programIds, duplications: dup = {}, ctx }) {
  const duplications = dup;

  const configs = await ctx.tx.db.Configs.find({
    $or: _.map(_.isArray(programIds) ? programIds : [programIds], (programId) => ({
      key: `/^program-${programId}/i`,
    })),
  }).lean();
  await ctx.tx.emit('before-duplicate-program-configs', {
    configs,
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

      return ctx.tx.db.Configs.create({
        ...item,
        key,
      }).then((mongooseDoc) => mongooseDoc.toObject());
    })
  );

  // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
  // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
  if (!_.isObject(duplications.configs)) duplications.configs = {};
  _.forEach(configs, ({ id }, index) => {
    duplications.configs[id] = newConfigs[index];
  });

  await ctx.tx.emit('after-duplicate-program-configs', {
    configs,
    duplications: duplications.configs,
  });
  return true;
}

module.exports = { duplicateProgramConfigsByProgramIds };
