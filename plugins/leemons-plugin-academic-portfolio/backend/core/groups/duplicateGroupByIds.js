const _ = require('lodash');

async function duplicateGroupByIds({ ids, duplications: dup = {}, ctx }) {
  const duplications = dup;

  const groups = await ctx.tx.db.Groups.find({
    id: _.isArray(ids) ? ids : [ids],
    type: 'group',
  }).lean();
  await ctx.tx.emit('before-duplicate-groups', { groups });

  // ES: Empezamos la duplicación de los items
  // EN: Start the duplication of the items
  const newGroups = await Promise.all(
    _.map(groups, ({ id, ...item }) =>
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
  if (!_.isObject(duplications.groups)) duplications.groups = {};
  _.forEach(groups, ({ id }, index) => {
    duplications.groups[id] = newGroups[index];
  });

  await ctx.tx.emit('after-duplicate-groups', {
    groups,
    duplications: duplications.groups,
  });
  return duplications;
}

module.exports = { duplicateGroupByIds };
