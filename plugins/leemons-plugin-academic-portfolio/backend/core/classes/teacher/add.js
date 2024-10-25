const { getProfiles } = require('../../settings/getProfiles');
const {
  addPermissionsBetweenStudentsAndTeachers,
} = require('../addPermissionsBetweenStudentsAndTeachers');
const { addPermissionsBetweenTeachers } = require('../addPermissionsBetweenTeachers');
const { getClassProgram } = require('../getClassProgram');

const ADD_CUSTOM_PERMISSION_USER_AGENT = 'users.permissions.addCustomPermissionToUserAgent';

async function add({ class: _class, teacher, type, ctx }) {
  const [classTeacher, program] = await Promise.all([
    ctx.tx.db.ClassTeacher.create({
      class: _class,
      teacher,
      type,
    }).then((mongooseDoc) => mongooseDoc.toObject()),
    getClassProgram({ id: _class, ctx }),
    ctx.tx.call('comunica.room.addUserAgents', {
      key: ctx.prefixPN(`room.class.${_class}`),
      userAgents: teacher,
      isAdmin: true,
    }),
    ctx.tx.call('comunica.room.addUserAgents', {
      key: ctx.prefixPN(`room.class.group.${_class}`),
      userAgents: teacher,
    }),
  ]);

  const { teacher: teacherProfileId } = await getProfiles({ ctx });

  await ctx.tx.call(ADD_CUSTOM_PERMISSION_USER_AGENT, {
    userAgentId: teacher,
    throwIfExists: false,
    data: {
      permissionName: `academic-portfolio.class.${_class}`,
      actionNames: ['view', 'edit'],
    },
  });

  // Permissions for the class main teacher
  if (type === 'main-teacher') {
    await ctx.tx.call(ADD_CUSTOM_PERMISSION_USER_AGENT, {
      userAgentId: teacher,
      throwIfExists: false,
      data: {
        permissionName: `academic-portfolio.class.${_class}.mainTeacher`,
        actionNames: ['view', 'edit'],
      },
    });
  }

  await ctx.tx.call(ADD_CUSTOM_PERMISSION_USER_AGENT, {
    userAgentId: teacher,
    throwIfExists: false,
    data: {
      permissionName: `academic-portfolio.class-profile.${_class}.${teacherProfileId}`,
      actionNames: ['view', 'edit'],
    },
  });

  try {
    await ctx.call(ADD_CUSTOM_PERMISSION_USER_AGENT, {
      userAgentId: teacher,
      throwIfExists: false,
      data: {
        permissionName: `academic-portfolio.program.inside.${program.id}`,
        actionNames: ['view'],
      },
    });
  } catch (e) {
    // Nothing
  }

  try {
    await ctx.call(ADD_CUSTOM_PERMISSION_USER_AGENT, {
      userAgentId: teacher,
      throwIfExists: false,
      data: {
        permissionName: `academic-portfolio.program-profile.inside.${program.id}-${teacherProfileId}`,
        actionNames: ['view'],
      },
    });
  } catch (e) {
    // Nothing
  }

  await addPermissionsBetweenStudentsAndTeachers({ classId: _class, ctx });
  await addPermissionsBetweenTeachers({ programId: program.id, ctx });

  await ctx.emit('after-add-class-teacher', {
    class: _class,
    teacher,
    type,
  });

  return classTeacher;
}

module.exports = { add };
