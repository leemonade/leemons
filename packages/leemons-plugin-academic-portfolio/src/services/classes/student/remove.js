const _ = require('lodash');
const { table } = require('../../tables');

async function remove(classId, studentId, { soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const classStudent = await table.classStudent.findOne(
        { class: classId, student: studentId },
        { soft, transacting }
      );
      if (!classStudent) {
        throw new Error(`Class student with class ${classId} and student ${studentId} not found`);
      }
      await leemons.events.emit('before-remove-students-from-class', {
        classStudent,
        studentId,
        classId,
        soft,
        transacting,
      });

      await table.classStudent.delete({ id: classStudent.id }, { soft, transacting });

      // TODO: Quitar permiso de que pueda ver al resto de alumnos y profesores

      await leemons.getPlugin('users').services.permissions.removeCustomUserAgentPermission(
        classStudent.student,
        {
          permissionName: `plugins.academic-portfolio.class.${classStudent.class}`,
        },
        { transacting }
      );

      await leemons.events.emit('after-remove-students-from-class', {
        classStudent,
        studentId,
        classId,
        soft,
        transacting,
      });

      return true;
    },
    table.classStudent,
    _transacting
  );
}

module.exports = { remove };
