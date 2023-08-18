const { table } = require('../../tables');
const { getClassProgram } = require('../getClassProgram');

const { getProfiles } = require('../../settings/getProfiles');
const { removeCustomPermissions } = require('./removeCustomPermissions');

async function remove(classId, studentId, { soft, transacting: _transacting } = {}) {
  const roomService = leemons.getPlugin('comunica').services.room;

  return global.utils.withTransaction(
    async (transacting) => {
      const [classStudent, program] = await Promise.all([
        table.classStudent.findOne({ class: classId, student: studentId }, { soft, transacting }),
        getClassProgram(classId),
        roomService.removeUserAgents(leemons.plugin.prefixPN(`room.class.${classId}`), studentId, {
          transacting,
        }),
      ]);
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

      const { removeUserAgentContacts } = leemons.getPlugin('users').services.users;
      const promises = [];
      promises.push(removeUserAgentContacts(studentId, '*', { target: classId, transacting }));
      promises.push(removeUserAgentContacts('*', studentId, { target: classId, transacting }));
      await Promise.all(promises);
      const { student: studentProfileId } = await getProfiles({ transacting });

      await leemons.getPlugin('users').services.permissions.removeCustomUserAgentPermission(
        classStudent.student,
        {
          permissionName: `plugins.academic-portfolio.class.${classStudent.class}`,
        },
        { transacting }
      );

      await leemons.getPlugin('users').services.permissions.removeCustomUserAgentPermission(
        classStudent.student,
        {
          permissionName: `plugins.academic-portfolio.class-profile.${classStudent.class}.${studentProfileId}`,
        },
        { transacting }
      );

      await removeCustomPermissions(studentId, program.id, { transacting });

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
