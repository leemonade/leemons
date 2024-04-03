const _ = require('lodash');

async function duplicateByClass({ classIds, duplications: dup = {}, ctx }) {
  const duplications = dup;
  const classGroups = await ctx.tx.db.ClassGroup.find({
    class: _.isArray(classIds) ? classIds : [classIds],
  }).lean();
  await ctx.tx.emit('before-duplicate-classes-groups', {
    classGroups,
  });

  // ES: Empezamos la duplicación de los items
  // EN: Start the duplication of the items
  const newItems = await Promise.all(
    _.map(classGroups, ({ id, _id, __v, updatedAt, createdAt, ...item }) =>
      ctx.tx.db.ClassGroup.create({
        ...item,
        class:
          duplications.classes && duplications.classes[item.class]
            ? duplications.classes[item.class].id
            : item.class,
        group:
          duplications.groups && duplications.groups[item.group]
            ? duplications.groups[item.group].id
            : item.group,
      }).then((mongooseDoc) => mongooseDoc.toObject())
    )
  );

  // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
  // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
  if (!_.isObject(duplications.classGroups)) duplications.classGroups = {};
  _.forEach(classGroups, ({ id }, index) => {
    duplications.classGroups[id] = newItems[index];
  });

  await ctx.tx.emit('after-duplicate-classes-groups', {
    classGroups,
    duplications: duplications.classGroups,
  });
  return duplications;
}

module.exports = { duplicateByClass };
