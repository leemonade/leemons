const {
  addPermissionsBetweenStudentsAndTeachers,
} = require('../addPermissionsBetweenStudentsAndTeachers');
const { getClassProgram } = require('../getClassProgram');
const { getProfiles } = require('../../settings/getProfiles');

async function add({ class: _class, student, ctx }) {
  // TODO check again when comunica is migrated
  const [classStudent, program] = await Promise.all([
    ctx.tx.db.ClassStudent.create({ class: _class, student }).then((mongooseDoc) =>
      mongooseDoc.toObject()
    ),
    getClassProgram({ id: _class, ctx }),
    ctx.tx.call('comunica.room.addUserAgents', {
      room: ctx.prefixPN(`room.class.${_class}`),
      userAgent: student,
    }),
  ]);

  const { student: studentProfileId } = await getProfiles({ ctx });

  await ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
    userAgentId: student,
    data: {
      permissionName: `academic-portfolio.class.${_class}`,
      actionNames: ['view'],
    },
  });

  await ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
    userAgentId: student,
    data: {
      permissionName: `academic-portfolio.class-profile.${_class}.${studentProfileId}`,
      actionNames: ['view'],
    },
  });

  try {
    await ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
      userAgentId: student,
      data: {
        permissionName: `academic-portfolio.program.inside.${program.id}`,
        actionNames: ['view'],
      },
    });
  } catch (e) {
    // Nothing
  }

  try {
    await ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
      userAgentId: student,
      data: {
        permissionName: `academic-portfolio.program-profile.inside.${program.id}.${studentProfileId}`,
        actionNames: ['view'],
      },
    });
  } catch (e) {
    // Nothing
  }

  if (!program.hideStudentsToStudents) {
    addPermissionsBetweenStudentsAndTeachers({ classId: _class, ctx });
  }
  await ctx.tx.emit('after-add-class-student', { class: _class, student });
  return classStudent;
}

module.exports = { add };
