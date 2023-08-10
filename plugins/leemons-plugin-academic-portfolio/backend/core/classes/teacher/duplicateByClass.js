const _ = require('lodash');

async function duplicateByClass({ classIds, duplications: dup = {}, ctx }) {
  const duplications = dup;
  const classTeachers = await ctx.tx.db.ClassTeacher.find({
    class: _.isArray(classIds) ? classIds : [classIds],
  }).lean();
  await ctx.tx.emit('before-duplicate-classes-teachers', {
    classTeachers,
  });

  // ES: Empezamos la duplicación de los items
  // EN: Start the duplication of the items
  const newItems = await Promise.all(
    _.map(classTeachers, ({ id, ...item }) =>
      ctx.tx.db.ClassTeacher.create({
        ...item,
        class:
          duplications.classes && duplications.classes[item.class]
            ? duplications.classes[item.class].id
            : item.class,
      })
    )
  );

  // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
  // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
  if (!_.isObject(duplications.classTeachers)) duplications.classTeachers = {};
  _.forEach(classTeachers, ({ id }, index) => {
    duplications.classTeachers[id] = newItems[index];
  });

  await ctx.tx.emit('after-duplicate-classes-teachers', {
    classTeachers,
    duplications: duplications.classTeachers,
  });
  return duplications;
}

module.exports = { duplicateByClass };
