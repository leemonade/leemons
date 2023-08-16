const { LeemonsError } = require('leemons-error');
const { getClassProgram } = require('../getClassProgram');
const { getProfiles } = require('../../settings/getProfiles');
const { removeCustomPermissions } = require('./removeCustomPermissions');

async function remove({ classId, studentId, soft, ctx }) {
  const [classStudent, program] = await Promise.all([
    // TODO ask: findOne where soft... Tiene sentido tener la opción de buscar en los borrados para hacer un hard delete?
    ctx.tx.db.ClassStudent.findOne(
      { class: classId, student: studentId }
      // { excludeDeleted: soft }
    ).lean(),
    getClassProgram({ id: classId, ctx }),
    ctx.tx.call('comunica.room.removeUserAgents', {
      key: ctx.prefixPN(`room.class.${classId}`),
      userAgents: studentId,
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

  await ctx.tx.db.ClassStudent.delete({ id: classStudent.id }, { soft });

  const promises = [];
  promises.push(
    ctx.tx.call('users.users.removeUserAgentContacts', {
      fromUserAgent: studentId,
      toUserAgent: '*',
      target: classId,
    })
  );
  promises.push('users.users.removeUserAgentContacts', {
    fromUserAgent: '*',
    toUserAgent: studentId,
    target: classId,
  });
  await Promise.all(promises);
  const { student: studentProfileId } = await getProfiles({ ctx });

  await ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
    userAgentId: classStudent.student,
    data: {
      permissionName: `plugins.academic-portfolio.class.${classStudent.class}`,
    },
  });

  await ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
    userAgentId: classStudent.student,
    data: {
      permissionName: `plugins.academic-portfolio.class-profile.${classStudent.class}.${studentProfileId}`,
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
