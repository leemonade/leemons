const { table } = require('../../tables');

async function add(_class, student, { transacting } = {}) {
  const classStudent = await table.classStudent.create({ class: _class, student }, { transacting });

  await leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
    student,
    {
      permissionName: `plugins.academic-portfolio.class.${_class}`,
      actionNames: ['view'],
    },
    { transacting }
  );

  await leemons.events.emit('after-add-class-student', { class: _class, student, transacting });
  return classStudent;
}

module.exports = { add };
