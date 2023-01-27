const _ = require('lodash');
const { table } = require('../../tables');

async function removeByClass(classIds, { soft, transacting: _transacting } = {}) {
  const roomService = leemons.getPlugin('comunica').services.room;

  return global.utils.withTransaction(
    async (transacting) => {
      const classeIds = _.isArray(classIds) ? classIds : [classIds];

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
