const _ = require('lodash');
const { table } = require('../../tables');

async function removeByClass(classIds, { soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const classTeachers = await table.classTeacher.find(
        { class_$in: _.isArray(classIds) ? classIds : [classIds] },
        { transacting }
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
