const { map } = require('lodash');
const { table } = require('../../tables');
const {
  addPermissionsBetweenStudentsAndTeachers,
} = require('../addPermissionsBetweenStudentsAndTeachers');
const { getClassProgram } = require('../getClassProgram');
const { getProfiles } = require('../../settings/getProfiles');

async function add(_class, student, { transacting } = {}) {
  const roomService = leemons.getPlugin('comunica').services.room;

  const [classStudent, program] = await Promise.all([
    table.classStudent.create({ class: _class, student }, { transacting }),
    getClassProgram(_class),
    roomService.addUserAgents(leemons.plugin.prefixPN(`room.class.${_class}`), student, {
      transacting,
    }),
  ]);

  const { student: studentProfileId } = await getProfiles({ transacting });

  await leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
    student,
    {
      permissionName: `plugins.academic-portfolio.class.${_class}`,
      actionNames: ['view'],
    },
    { transacting }
  );

  await leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
    student,
    {
      permissionName: `plugins.academic-portfolio.class-profile.${_class}.${studentProfileId}`,
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

  try {
    await leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
      student,
      {
        permissionName: `plugins.academic-portfolio.program-profile.inside.${program.id}.${studentProfileId}`,
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
