const _ = require('lodash');
const { table } = require('../../tables');
const { getClassProgram } = require('../getClassProgram');
const { removeCustomPermissions } = require('./removeCustomPermissions');
const { getProfiles } = require('../../settings/getProfiles');

async function removeByClass(classIds, { soft, transacting: _transacting } = {}) {
  const roomService = leemons.getPlugin('comunica').services.room;

  return global.utils.withTransaction(
    async (transacting) => {
      const classeIds = _.isArray(classIds) ? classIds : [classIds];

      const programs = await Promise.all(_.map(classeIds, (classId) => getClassProgram(classId)));

      const classTeachers = await table.classTeacher.find(
        { class_$in: classeIds },
        { transacting }
      );

      // Remove users from class room
      await Promise.all(
        _.map(classeIds, (classId) => {
          const userIds = _.map(_.filter(classTeachers, { class: classId }), 'teacher');
          return roomService.removeUserAgents(
            leemons.plugin.prefixPN(`room.class.${classId}`),
            userIds,
            { transacting }
          );
        })
      );

      const programIds = _.uniq(_.map(programs, 'id'));

      await Promise.all(
        _.map(programIds, (programId) =>
          Promise.all(
            _.map(classTeachers, (classStudent) =>
              removeCustomPermissions(classStudent.teacher, programId, { transacting })
            )
          )
        )
      );

      await leemons.events.emit('before-remove-classes-teachers', {
        classTeachers,
        soft,
        transacting,
      });
      await table.classTeacher.deleteMany(
        { id_$in: _.map(classTeachers, 'id') },
        { soft, transacting }
      );

      const { teacher: teacherProfileId } = await getProfiles({ transacting });

      // TODO Add remove `plugins.academic-portfolio.program.inside.${program.id}`

      await Promise.all(
        _.map(classTeachers, (classTeacher) =>
          leemons.getPlugin('users').services.permissions.removeCustomUserAgentPermission(
            classTeacher.teacher,
            {
              permissionName: `plugins.academic-portfolio.class.${classTeacher.class}`,
            },
            { transacting }
          )
        )
      );

      await Promise.all(
        _.map(classTeachers, (classTeacher) =>
          leemons.getPlugin('users').services.permissions.removeCustomUserAgentPermission(
            classTeacher.teacher,
            {
              permissionName: `plugins.academic-portfolio.class-profile.${classTeacher.class}.${teacherProfileId}`,
            },
            { transacting }
          )
        )
      );

      const { removeUserAgentContacts } = leemons.getPlugin('users').services.users;
      const teacherIds = _.map(classTeachers, 'teacher');
      const promises = [];
      _.forEach(classIds, (classId) => {
        promises.push(removeUserAgentContacts(teacherIds, '*', { target: classId, transacting }));
        promises.push(removeUserAgentContacts('*', teacherIds, { target: classId, transacting }));
      });
      await Promise.all(promises);

      await leemons.events.emit('after-remove-classes-teachers', {
        classTeachers,
        classIds: _.isArray(classIds) ? classIds : [classIds],
        soft,
        transacting,
      });
      return true;
    },
    table.classTeacher,
    _transacting
  );
}

module.exports = { removeByClass };
