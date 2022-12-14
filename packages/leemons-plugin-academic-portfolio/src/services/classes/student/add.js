const { table } = require('../../tables');
const {
  addPermissionsBetweenStudentsAndTeachers,
} = require('../addPermissionsBetweenStudentsAndTeachers');

async function add(_class, student, { transacting } = {}) {
  const classStudent = table.classStudent.create({ class: _class, student }, { transacting });

  await leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
    student,
    {
      permissionName: `plugins.academic-portfolio.class.${_class}`,
      actionNames: ['view'],
    },
    { transacting }
  );

  addPermissionsBetweenStudentsAndTeachers(_class);

  await leemons.events.emit('after-add-class-student', { class: _class, student, transacting });
  return classStudent;
}

module.exports = { add };
