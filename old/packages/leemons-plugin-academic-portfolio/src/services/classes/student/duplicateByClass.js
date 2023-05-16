const _ = require('lodash');
const { table } = require('../../tables');
const {
  addPermissionsBetweenStudentsAndTeachers,
} = require('../addPermissionsBetweenStudentsAndTeachers');
const { getProfiles } = require('../../settings/getProfiles');

async function duplicateByClass(
  classIds,
  { duplications: dup = {}, transacting: _transacting } = {}
) {
  const duplications = dup;
  return global.utils.withTransaction(
    async (transacting) => {
      const classStudents = await table.classStudent.find(
        { class_$in: _.isArray(classIds) ? classIds : [classIds] },
        { transacting }
      );
      await leemons.events.emit('before-duplicate-classes-students', {
        classStudents,
        transacting,
      });

      // TODO Mirar los permisos de que puedan verse entre ellos

      // ES: Empezamos la duplicación de los items
      // EN: Start the duplication of the items
      const newItems = await Promise.all(
        _.map(classStudents, ({ id, ...item }) =>
          table.classStudent.create(
            {
              ...item,
              class:
                duplications.classes && duplications.classes[item.class]
                  ? duplications.classes[item.class].id
                  : item.class,
            },
            { transacting }
          )
        )
      );

      await Promise.all(
        _.map(classStudents, ({ student, ...item }) =>
          leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
            student,
            {
              permissionName: `plugins.academic-portfolio.class.${
                duplications.classes && duplications.classes[item.class]
                  ? duplications.classes[item.class].id
                  : item.class
              }`,
              actionNames: ['view'],
            },
            { transacting }
          )
        )
      );

      const { student: studentProfileId } = await getProfiles({ transacting });

      await Promise.all(
        _.map(classStudents, ({ student, ...item }) =>
          leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
            student,
            {
              permissionName: `plugins.academic-portfolio.class-profile.${
                duplications.classes && duplications.classes[item.class]
                  ? duplications.classes[item.class].id
                  : item.class
              }.${studentProfileId}`,
              actionNames: ['view'],
            },
            { transacting }
          )
        )
      );

      // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
      // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
      if (!_.isObject(duplications.classStudents)) duplications.classStudents = {};
      _.forEach(classStudents, ({ id }, index) => {
        duplications.classStudents[id] = newItems[index];
      });

      await Promise.all(
        _.map(classIds, (_class) =>
          addPermissionsBetweenStudentsAndTeachers(_class, { transacting })
        )
      );

      await leemons.events.emit('after-duplicate-classes-students', {
        classStudents,
        duplications: duplications.classStudents,
        transacting,
      });
      return duplications;
    },
    table.classStudent,
    _transacting
  );
}

module.exports = { duplicateByClass };
