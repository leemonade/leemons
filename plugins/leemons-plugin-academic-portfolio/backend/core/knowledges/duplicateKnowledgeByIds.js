const _ = require('lodash');

async function duplicateKnowledgeByIds({ ids, duplications: dup = {}, ctx }) {
  const duplications = dup;
  const knowledges = await ctx.tx.db.KnowledgeAreas.find({ id: _.isArray(ids) ? ids : [ids] }).lean();
  await ctx.tx.emit('before-duplicate-knowledges', { knowledges });

  // ES: Empezamos la duplicación de los items
  // EN: Start the duplication of the items
  const newKnowledges = await Promise.all(
    _.map(knowledges, ({ id, ...item }) =>
      ctx.tx.db.KnowledgeAreas.create({
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
  if (!_.isObject(duplications.knowledges)) duplications.knowledges = {};
  _.forEach(knowledges, ({ id }, index) => {
    duplications.knowledges[id] = newKnowledges[index];
  });
  await ctx.tx.emit('after-duplicate-knowledges', {
    knowledges,
    duplications: duplications.knowledges,
  });
  return duplications;
}

module.exports = { duplicateKnowledgeByIds };
