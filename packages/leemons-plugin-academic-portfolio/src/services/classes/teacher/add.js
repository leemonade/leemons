const { map } = require('lodash');
const { table } = require('../../tables');
const {
  addPermissionsBetweenStudentsAndTeachers,
} = require('../addPermissionsBetweenStudentsAndTeachers');
const { getClassProgram } = require('../getClassProgram');
const { getProfiles } = require('../../settings/getProfiles');

async function add(_class, teacher, type, { transacting } = {}) {
  const roomService = leemons.getPlugin('comunica').services.room;

  const [classTeacher, program] = await Promise.all([
    table.classTeacher.create(
      {
        class: _class,
        teacher,
        type,
      },
      { transacting }
    ),
    getClassProgram(_class),
    roomService.addUserAgents(leemons.plugin.prefixPN(`room.class.${_class}`), teacher, {
      transacting,
      isAdmin: true,
    }),
  ]);

  const { teacher: teacherProfileId } = await getProfiles({ transacting });

  await leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
    teacher,
    {
      permissionName: `plugins.academic-portfolio.class.${_class}`,
      actionNames: ['view', 'edit'],
    },
    { transacting }
  );

  await leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
    teacher,
    {
      permissionName: `plugins.academic-portfolio.class-profile.${_class}.${teacherProfileId}`,
      actionNames: ['view', 'edit'],
    },
    { transacting }
  );

  try {
    await leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
      teacher,
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
    const { teacher: teacherProfileId } = await getProfiles({ transacting });
    await leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
      teacher,
      {
        permissionName: `plugins.academic-portfolio.program-profile.inside.${program.id}-${teacherProfileId}`,
        actionNames: ['view'],
      },
      { transacting }
    );
  } catch (e) {
    // Nothing
  }

  await addPermissionsBetweenStudentsAndTeachers(_class, { transacting });

  await leemons.events.emit('after-add-class-teacher', {
    class: _class,
    teacher,
    type,
    transacting,
  });

  return classTeacher;
}

module.exports = { add };
