const { map } = require('lodash');
const { table } = require('../../tables');
const {
  addPermissionsBetweenStudentsAndTeachers,
} = require('../addPermissionsBetweenStudentsAndTeachers');
const { getClassProgram } = require('../getClassProgram');

async function add(_class, student, { transacting } = {}) {
  const [classStudent, program] = await Promise.all([
    table.classStudent.create({ class: _class, student }, { transacting }),
    getClassProgram(_class),
  ]);

  await leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
    student,
    {
      permissionName: `plugins.academic-portfolio.class.${_class}`,
      actionNames: ['view'],
    },
    { transacting }
  );

  try {
    await leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
      student,
      {
        permissionName: `plugins.academic-portfolio.program.inside.${program.id}`,
        actionNames: ['view'],
      },
      { transacting }
    );
  } catch (e) {
    // Nothing
  }

  if (!program.hideStudentsToStudents) {
    addPermissionsBetweenStudentsAndTeachers(_class, { transacting });
  }
  await leemons.events.emit('after-add-class-student', { class: _class, student, transacting });
  return classStudent;
}

module.exports = { add };
