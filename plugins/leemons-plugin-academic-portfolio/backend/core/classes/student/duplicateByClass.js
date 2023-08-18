const _ = require('lodash');
const {
  addPermissionsBetweenStudentsAndTeachers,
} = require('../addPermissionsBetweenStudentsAndTeachers');
const { getProfiles } = require('../../settings/getProfiles');

async function duplicateByClass({ classIds, duplications: dup = {}, ctx } = {}) {
  const duplications = dup;
  const classStudents = await ctx.tx.db.ClassStudent.find({
    class: _.isArray(classIds) ? classIds : [classIds],
  }).lean();
  await ctx.tx.emit('before-duplicate-classes-students', {
    classStudents,
  });

  // TODO Mirar los permisos de que puedan verse entre ellos

  // ES: Empezamos la duplicación de los items
  // EN: Start the duplication of the items
  const newItems = await Promise.all(
    _.map(classStudents, ({ id, ...item }) =>
      ctx.tx.db.ClassStudent.create({
        ...item,
        class:
          duplications.classes && duplications.classes[item.class]
            ? duplications.classes[item.class].id
            : item.class,
      })
    )
  );

  await Promise.all(
    _.map(classStudents, ({ student, ...item }) =>
      ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
        userAgentId: student,
        data: {
          permissionName: `plugins.academic-portfolio.class.${
            duplications.classes && duplications.classes[item.class]
              ? duplications.classes[item.class].id
              : item.class
          }`,
          actionNames: ['view'],
        },
      })
    )
  );

  const { student: studentProfileId } = await getProfiles({ ctx });

  await Promise.all(
    _.map(classStudents, ({ student, ...item }) =>
      ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
        userAgentId: student,
        data: {
          permissionName: `plugins.academic-portfolio.class-profile.${
            duplications.classes && duplications.classes[item.class]
              ? duplications.classes[item.class].id
              : item.class
          }.${studentProfileId}`,
          actionNames: ['view'],
        },
      })
    )
  );

  // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
  // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
  if (!_.isObject(duplications.classStudents)) duplications.classStudents = {};
  _.forEach(classStudents, ({ id }, index) => {
    duplications.classStudents[id] = newItems[index];
  });

  await Promise.all(
    _.map(classIds, (_class) => addPermissionsBetweenStudentsAndTeachers({ classId: _class, ctx }))
  );

  await ctx.tx.emit('after-duplicate-classes-students', {
    classStudents,
    duplications: duplications.classStudents,
  });
  return duplications;
}

module.exports = { duplicateByClass };
