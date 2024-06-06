const _ = require('lodash');

async function duplicateByClass({ classIds, duplications: dup = {}, ctx }) {
  const duplications = dup;
  const classKnowledges = await ctx.tx.db.ClassKnowledges.find({
    class: _.isArray(classIds) ? classIds : [classIds],
  }).lean();
  await ctx.tx.emit('before-duplicate-classes-knowledges', {
    classKnowledges,
  });

  // ES: Empezamos la duplicación de los items
  // EN: Start the duplication of the items
  const newItems = await Promise.all(
    _.map(classKnowledges, ({ id, _id, __v, updatedAt, createdAt, ...item }) =>
      ctx.tx.db.ClassKnowledges.create({
        ...item,
        class:
          duplications.classes && duplications.classes[item.class]
            ? duplications.classes[item.class].id
            : item.class,
        knowledge:
          duplications.knowledges && duplications.knowledges[item.knowledge]
            ? duplications.knowledges[item.knowledge].id
            : item.knowledge,
      }).then((mongooseDoc) => mongooseDoc.toObject())
    )
  );

  // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
  // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
  if (!_.isObject(duplications.classesKnowledges)) duplications.classesKnowledges = {};
  _.forEach(classKnowledges, ({ id }, index) => {
    duplications.classesKnowledges[id] = newItems[index];
  });

  await ctx.tx.emit('after-duplicate-classes-knowledges', {
    classKnowledges,
    duplications: duplications.classesKnowledges,
  });
  return duplications;
}

module.exports = { duplicateByClass };
