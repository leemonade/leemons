const { LeemonsError } = require('@leemons/error');

const { getProfiles } = require('../../settings/getProfiles');
const { getClassProgram } = require('../getClassProgram');

const { removeCustomPermissions } = require('./removeCustomPermissions');

async function remove({ classId, studentId, soft, ctx }) {
  const [classStudent, program] = await Promise.all([
    ctx.tx.db.ClassStudent.findOne({ class: classId, student: studentId }).lean(),
    getClassProgram({ id: classId, ctx }),
  ]);

  await Promise.allSettled([
    ctx.tx.call('comunica.room.removeUserAgents', {
      key: ctx.prefixPN(`room.class.${classId}`),
      userAgents: studentId,
    }),
    ctx.tx.call('comunica.room.removeUserAgents', {
      key: ctx.prefixPN(`room.class.group.${classId}`),
      userAgents: studentId,
    }),
    ctx.tx.call('comunica.room.removeAllUserAgents', {
      key: ctx.prefixPN(`room.class.${classId}.student.${studentId}.teachers`),
    }),
  ]);

  if (!classStudent) {
    throw new LeemonsError(ctx, {
      message: `Class student with class ${classId} and student ${studentId} not found`,
    });
  }
  await ctx.tx.emit('before-remove-students-from-class', {
    classStudent,
    studentId,
    classId,
    soft,
  });

  await ctx.tx.db.ClassStudent.deleteOne({ id: classStudent.id }, { soft });

  const promises = [];
  promises.push(
    ctx.tx.call('users.users.removeUserAgentContacts', {
      fromUserAgent: studentId,
      toUserAgent: '*',
      target: classId,
    })
  );
  promises.push(
    ctx.tx.call('users.users.removeUserAgentContacts', {
      fromUserAgent: '*',
      toUserAgent: studentId,
      target: classId,
    })
  );
  await Promise.all(promises);
  const { student: studentProfileId } = await getProfiles({ ctx });

  await ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
    userAgentId: classStudent.student,
    data: {
      permissionName: `academic-portfolio.class.${classStudent.class}`,
    },
  });

  await ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
    userAgentId: classStudent.student,
    data: {
      permissionName: `academic-portfolio.class-profile.${classStudent.class}.${studentProfileId}`,
    },
  });

  await removeCustomPermissions({ studentId, programId: program.id, ctx });

  await ctx.tx.emit('after-remove-students-from-class', {
    classStudent,
    studentId,
    classId,
    soft,
  });

  return true;
}

module.exports = { remove };
