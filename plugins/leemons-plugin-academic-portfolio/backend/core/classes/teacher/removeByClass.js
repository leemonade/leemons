const _ = require('lodash');
const { getClassProgram } = require('../getClassProgram');
const { removeCustomPermissions } = require('./removeCustomPermissions');
const { getProfiles } = require('../../settings/getProfiles');

async function removeByClass({ classIds, soft, ctx }) {
  // const roomService = leemons.getPlugin('comunica').services.room;

  const classeIds = _.isArray(classIds) ? classIds : [classIds];

  const programs = await Promise.all(
    _.map(classeIds, (classId) => getClassProgram({ id: classId, ctx }))
  );

  const classTeachers = await ctx.tx.db.ClassTeacher.find({ class: classeIds }).lean();

  // Remove users from class room
  await Promise.all(
    _.map(classeIds, (classId) => {
      const userIds = _.map(_.filter(classTeachers, { class: classId }), 'teacher');
      // ! Verificar que userAgents coincide con la función cuando comunica esté migrado.
      return ctx.tx.call('comunica.room.removeUserAgents', {
        key: ctx.prefixPN(`room.class.${classId}`),
        userAgents: userIds,
      });
    })
  );

  const programIds = _.uniq(_.map(programs, 'id'));

  await Promise.all(
    _.map(programIds, (programId) =>
      Promise.all(
        _.map(classTeachers, (classStudent) =>
          removeCustomPermissions({ teacherId: classStudent.teacher, programId, ctx })
        )
      )
    )
  );

  await ctx.tx.emit('before-remove-classes-teachers', {
    classTeachers,
    soft,
  });
  await ctx.tx.db.ClassTeacher.deleteMany({ id: _.map(classTeachers, 'id') }, { soft });

  const { teacher: teacherProfileId } = await getProfiles({ ctx });

  // TODO Add remove `plugins.academic-portfolio.program.inside.${program.id}`

  await Promise.all(
    _.map(classTeachers, (classTeacher) =>
      ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
        userAgentId: classTeacher.teacher,
        data: {
          permissionName: `plugins.academic-portfolio.class.${classTeacher.class}`,
        },
      })
    )
  );

  await Promise.all(
    _.map(classTeachers, (classTeacher) =>
      ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
        userAgentId: classTeacher.teacher,
        data: {
          permissionName: `plugins.academic-portfolio.class-profile.${classTeacher.class}.${teacherProfileId}`,
        },
      })
    )
  );

  // const { removeUserAgentContacts } = leemons.getPlugin('users').services.users;
  const teacherIds = _.map(classTeachers, 'teacher');
  const promises = [];
  _.forEach(classIds, (classId) => {
    promises.push(
      ctx.tx.call('users.users.removeUserAgentContacts', {
        fromUserAgent: teacherIds,
        toUserAgent: '*',
        target: classId,
      })
    );
    promises.push(
      ctx.tx.call('users.users.removeUserAgentContacts', {
        fromUserAgent: '*',
        toUserAgent: teacherIds,
        target: classId,
      })
    );
  });
  await Promise.all(promises);

  await ctx.tx.emit('after-remove-classes-teachers', {
    classTeachers,
    classIds: _.isArray(classIds) ? classIds : [classIds],
    soft,
  });
  return true;
}

module.exports = { removeByClass };
