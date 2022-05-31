const { map } = require('lodash');
const { table } = require('../../tables');
const {
  addPermissionsBetweenStudentsAndTeachers,
} = require('../addPermissionsBetweenStudentsAndTeachers');

async function add(_class, teacher, type, { transacting } = {}) {
  const classTeacher = await table.classTeacher.create(
    {
      class: _class,
      teacher,
      type,
    },
    { transacting }
  );

  await leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
    teacher,
    {
      permissionName: `plugins.academic-portfolio.class.${_class}`,
      actionNames: ['view', 'edit'],
    },
    { transacting }
  );

  await addPermissionsBetweenStudentsAndTeachers(_class, { transacting });

  await leemons.events.emit('after-add-class-teacher', { class: _class, teacher, transacting });

  return classTeacher;
}

module.exports = { add };
