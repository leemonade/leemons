const { table } = require('../../tables');
const { getClassProgram } = require('../getClassProgram');
const { removeCustomPermissions } = require('./removeCustomPermissions');
const { getProfiles } = require('../../settings/getProfiles');

async function remove(classId, teacherId, { soft, transacting: _transacting } = {}) {
  const roomService = leemons.getPlugin('comunica').services.room;

  return global.utils.withTransaction(
    async (transacting) => {
      const [classTeacher, program] = await Promise.all([
        table.classTeacher.findOne({ class: classId, teacher: teacherId }, { soft, transacting }),
        getClassProgram(classId),
        roomService.removeUserAgents(leemons.plugin.prefixPN(`room.class.${classId}`), teacherId, {
          transacting,
        }),
      ]);
      if (!classTeacher) {
        throw new Error(`Class teacher with class ${classId} and teacher ${teacherId} not found`);
      }

      await removeCustomPermissions(classTeacher.teacher, program.id, { transacting });

      await leemons.events.emit('before-remove-class-teacher', {
        classTeacher,
        soft,
        transacting,
      });
      await table.classTeacher.deleteMany({ id: classTeacher.id }, { soft, transacting });

      const { teacher: teacherProfileId } = await getProfiles({ transacting });

      // TODO Add remove `plugins.academic-portfolio.program.inside.${program.id}`

      await leemons.getPlugin('users').services.permissions.removeCustomUserAgentPermission(
        classTeacher.teacher,
        {
          permissionName: `plugins.academic-portfolio.class.${classTeacher.class}`,
        },
        { transacting }
      );

      await leemons.getPlugin('users').services.permissions.removeCustomUserAgentPermission(
        classTeacher.teacher,
        {
          permissionName: `plugins.academic-portfolio.class-profile.${classTeacher.class}.${teacherProfileId}`,
        },
        { transacting }
      );

      const { removeUserAgentContacts } = leemons.getPlugin('users').services.users;
      const promises = [];
      promises.push(removeUserAgentContacts([teacherId], '*', { target: classId, transacting }));
      promises.push(removeUserAgentContacts('*', [teacherId], { target: classId, transacting }));
      await Promise.all(promises);

      await leemons.events.emit('after-remove-class-teacher', {
        classTeacher,
        classId,
        soft,
        transacting,
      });
      return true;
    },
    table.classTeacher,
    _transacting
  );
}

module.exports = { remove };
