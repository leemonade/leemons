const _ = require('lodash');

async function duplicateByClass({ classIds, duplications: dup = {}, ctx }) {
  const duplications = dup;
  const classSubstages = await ctx.tx.db.ClassSubstage.find({
    class: _.isArray(classIds) ? classIds : [classIds],
  }).lean();
  await ctx.tx.emit('before-duplicate-classes-substages', {
    classSubstages,
  });

  // ES: Empezamos la duplicación de los items
  // EN: Start the duplication of the items
  const newItems = await Promise.all(
    _.map(classSubstages, ({ id, ...item }) =>
      ctx.tx.db.ClassSubstage.create({
        ...item,
        class:
          duplications.classes && duplications.classes[item.class]
            ? duplications.classes[item.class].id
            : item.class,
        substage:
          duplications.substages && duplications.substages[item.substage]
            ? duplications.substages[item.substage].id
            : item.substage,
      }).then((mongooseDoc) => mongooseDoc.toObject())
    )
  );

  // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
  // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
  if (!_.isObject(duplications.classSubstages)) duplications.classSubstages = {};
  _.forEach(classSubstages, ({ id }, index) => {
    duplications.classSubstages[id] = newItems[index];
  });

  await ctx.tx.emit('after-duplicate-classes-substages', {
    classSubstages,
    duplications: duplications.classSubstages,
  });
  return duplications;
}
module.exports = { duplicateByClass };
