const _ = require('lodash');

async function duplicateByClass({ classIds, duplications: dup = {}, ctx }) {
  const duplications = dup;
  const classCourses = await ctx.tx.db.ClassCourse.find({
    class: _.isArray(classIds) ? classIds : [classIds],
  }).lean();
  await ctx.tx.emit('before-duplicate-classes-courses', {
    classCourses,
  });

  // ES: Empezamos la duplicación de los items
  // EN: Start the duplication of the items
  const newItems = await Promise.all(
    _.map(classCourses, ({ id, ...item }) =>
      ctx.tx.db.ClassCourse.create({
        ...item,
        class:
          duplications.classes && duplications.classes[item.class]
            ? duplications.classes[item.class].id
            : item.class,
        course:
          duplications.courses && duplications.courses[item.course]
            ? duplications.courses[item.course].id
            : item.course,
      })
    )
  );

  // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
  // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
  if (!_.isObject(duplications.classCourses)) duplications.classCourses = {};
  _.forEach(classCourses, ({ id }, index) => {
    duplications.classCourses[id] = newItems[index];
  });

  await ctx.tx.emit('after-duplicate-classes-courses', {
    classCourses,
    duplications: duplications.classCourses,
  });
  return duplications;
}

module.exports = { duplicateByClass };
