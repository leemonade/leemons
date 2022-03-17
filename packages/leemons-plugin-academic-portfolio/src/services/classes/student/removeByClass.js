const _ = require('lodash');
const { table } = require('../../tables');

async function removeByClass(classIds, { soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const classStudents = await table.classStudent.find(
        { class_$in: _.isArray(classIds) ? classIds : [classIds] },
        { soft, transacting }
      );
      await leemons.events.emit('before-remove-classes-students', {
        classStudents,
        soft,
        transacting,
      });
      await table.classStudent.deleteMany(
        { id_$in: _.map(classStudents, 'id') },
        { soft, transacting }
      );
      // TODO: remove classStudent permission from class
      /* Eliminar permiso de la clase
       * removeCustomUserAgentPermission */

      await Promise.all(
        _.map(classStudents, (classStudent) =>
          leemons.getPlugin('users').services.permissions.removeCustomUserAgentPermission(
            classStudent.student,
            {
              permissionName: `plugins.academic-portfolio.class.${classStudent.class}`,
            },
            { transacting }
          )
        )
      );

      await leemons.events.emit('after-remove-classes-students', {
        classStudents,
        classIds,
        soft,
        transacting,
      });
      return true;
    },
    table.classStudent,
    _transacting
  );
}

module.exports = { removeByClass };
