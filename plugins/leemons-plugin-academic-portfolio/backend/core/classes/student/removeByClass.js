const _ = require('lodash');
const { table } = require('../../tables');
const { removeCustomPermissions } = require('./removeCustomPermissions');
const { getProfiles } = require('../../settings/getProfiles');

async function removeByClass(classIds, { soft, transacting: _transacting } = {}) {
  const roomService = leemons.getPlugin('comunica').services.room;

  return global.utils.withTransaction(
    async (transacting) => {
      const classeIds = _.isArray(classIds) ? classIds : [classIds];

      const programs = await Promise.all(_.map(classeIds, (classId) => getClassProgram(classId)));

      const classStudents = await table.classStudent.find(
        { class_$in: classeIds },
        { transacting }
      );

      // Remove users from class room
      await Promise.all(
        _.map(classeIds, (classId) => {
          const userIds = _.map(_.filter(classStudents, { class: classId }), 'student');
          return roomService.removeUserAgents(
            leemons.plugin.prefixPN(`room.class.${classId}`),
            userIds,
            { transacting }
          );
        })
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

      const { removeUserAgentContacts } = leemons.getPlugin('users').services.users;
      const studentIds = _.map(classStudents, 'student');
      const promises = [];
      _.forEach(classIds, (classId) => {
        promises.push(removeUserAgentContacts(studentIds, '*', { target: classId, transacting }));
        promises.push(removeUserAgentContacts('*', studentIds, { target: classId, transacting }));
      });
      await Promise.all(promises);
      const { student: studentProfileId } = await getProfiles({ transacting });

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

      await Promise.all(
        _.map(classStudents, (classStudent) =>
          leemons.getPlugin('users').services.permissions.removeCustomUserAgentPermission(
            classStudent.student,
            {
              permissionName: `plugins.academic-portfolio.class-profile.${classStudent.class}.${studentProfileId}`,
            },
            { transacting }
          )
        )
      );

      const programIds = _.uniq(_.map(programs, 'id'));

      await Promise.all(
        _.map(programIds, (programId) =>
          Promise.all(
            _.map(classStudents, (classStudent) =>
              removeCustomPermissions(classStudent.student, programId, { transacting })
            )
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
