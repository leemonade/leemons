const _ = require('lodash');

async function duplicateSubstageByIds({ ids, duplications: dup = {}, ctx }) {
  const duplications = dup;

  const substages = await ctx.tx.db.Groups.find({
    id: _.isArray(ids) ? ids : [ids],
    type: 'substage',
  }).lean();
  await ctx.tx.emit('before-duplicate-substages', { substages });

  // ES: Empezamos la duplicación de los items
  // EN: Start the duplication of the items
  const newSubstages = await Promise.all(
    _.map(substages, ({ id, ...item }) =>
      ctx.tx.db.Groups.create({
        ...item,
        program:
          duplications.programs && duplications.programs[item.program]
            ? duplications.programs[item.program].id
            : item.program,
      }).then((mongooseDoc) => mongooseDoc.toObject())
    )
  );

  // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
  // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
  if (!_.isObject(duplications.substages)) duplications.substages = {};
  _.forEach(substages, ({ id }, index) => {
    duplications.substages[id] = newSubstages[index];
  });

  await ctx.tx.emit('after-duplicate-substages', {
    substages,
    duplications: duplications.substages,
  });
  return duplications;
}

module.exports = { duplicateSubstageByIds };
