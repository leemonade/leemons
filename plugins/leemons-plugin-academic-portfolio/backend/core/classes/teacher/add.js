const {
  addPermissionsBetweenStudentsAndTeachers,
} = require('../addPermissionsBetweenStudentsAndTeachers');
const { getClassProgram } = require('../getClassProgram');
const { getProfiles } = require('../../settings/getProfiles');

async function add({ class: _class, teacher, type, ctx }) {
  const [classTeacher, program] = await Promise.all([
    ctx.tx.db.ClassTeacher.create({
      class: _class,
      teacher,
      type,
    }),
    getClassProgram({ id: _class, ctx }),
    ctx.tx.call('comunica.room.addUserAgents', {
      room: ctx.prefixPN(`room.class.${_class}`),
      userAgent: teacher,
      isAdmin: true,
    }),
  ]);

  const { teacher: teacherProfileId } = await getProfiles({ ctx });

  await ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
    userAgent: teacher,
    data: {
      permissionName: `plugins.academic-portfolio.class.${_class}`,
      actionNames: ['view', 'edit'],
    },
  });

  await ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
    userAgent: teacher,
    data: {
      permissionName: `plugins.academic-portfolio.class-profile.${_class}.${teacherProfileId}`,
      actionNames: ['view', 'edit'],
    },
  });

  try {
    await ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
      userAgent: teacher,
      data: {
        permissionName: `plugins.academic-portfolio.program.inside.${program.id}`,
        actionNames: ['view'],
      },
    });
  } catch (e) {
    // Nothing
  }

  try {
    await ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
      userAgent: teacher,
      data: {
        permissionName: `plugins.academic-portfolio.program-profile.inside.${program.id}-${teacherProfileId}`,
        actionNames: ['view'],
      },
    });
  } catch (e) {
    // Nothing
  }

  await addPermissionsBetweenStudentsAndTeachers({ classId: _class, ctx });

  await ctx.tx.emit('after-add-class-teacher', {
    class: _class,
    teacher,
    type,
  });

  return classTeacher;
}

module.exports = { add };
