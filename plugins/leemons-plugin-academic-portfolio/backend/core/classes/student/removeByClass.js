const _ = require('lodash');
const { removeCustomPermissions } = require('./removeCustomPermissions');
const { getClassProgram } = require('../getClassProgram');
const { getProfiles } = require('../../settings/getProfiles');

async function removeByClass({ classIds, soft, ctx }) {
  const classeIds = _.isArray(classIds) ? classIds : [classIds];

  const programs = await Promise.all(
    _.map(classeIds, (classId) => getClassProgram({ id: classId, ctx }))
  );

  const classStudents = await ctx.tx.db.ClassStudent.find({ class: classeIds }).lean();

  // Remove users from class room
  await Promise.all(
    _.map(classeIds, (classId) => {
      const userIds = _.map(_.filter(classStudents, { class: classId }), 'student');
      return ctx.tx.call('comunica.room.removeUserAgents', {
        key: ctx.prefixPN(`room.class.${classId}`),
        userAgents: userIds, // TODO ask: Convención para parametros que empiezan con underscore, userAgents: _userAgents
      });
    })
  );

  await ctx.tx.emit('before-remove-classes-students', { classStudents, soft });

  await ctx.tx.db.ClassStudent.deleteMany({ id: _.map(classStudents, 'id') }, { soft });

  const studentIds = _.map(classStudents, 'student');
  const promises = [];
  _.forEach(classIds, (classId) => {
    promises.push(
      ctx.tx.call('users.users.removeUserAgentContacts', {
        fromUserAgent: studentIds,
        toUserAgent: '*',
        target: classId,
      })
    );
    promises.push(
      ctx.tx.call('users.users.removeUserAgentContacts', {
        fromUserAgent: '*',
        toUserAgent: studentIds,
        target: classId,
      })
    );
  });
  await Promise.all(promises);
  const { student: studentProfileId } = await getProfiles({ ctx });

  await Promise.all(
    _.map(classStudents, (classStudent) =>
      ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
        userAgentId: classStudent.student,
        data: {
          permissionName: `academic-portfolio.class.${classStudent.class}`,
        },
      })
    )
  );

  await Promise.all(
    _.map(classStudents, (classStudent) =>
      ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
        userAgentId: classStudent.student,
        data: {
          permissionName: `academic-portfolio.class-profile.${classStudent.class}.${studentProfileId}`,
        },
      })
    )
  );

  const programIds = _.uniq(_.map(programs, 'id'));

  await Promise.all(
    _.map(programIds, (programId) =>
      Promise.all(
        _.map(classStudents, (classStudent) =>
          removeCustomPermissions({ studentId: classStudent.student, programId, ctx })
        )
      )
    )
  );

  await ctx.tx.emit('after-remove-classes-students', {
    classStudents,
    classIds,
    soft,
  });
  return true;
}

module.exports = { removeByClass };
