const _ = require('lodash');

const { getProfiles } = require('../../settings/getProfiles');
const { getClassProgram } = require('../getClassProgram');

const { removeCustomPermissions } = require('./removeCustomPermissions');

async function removeByClass({ classIds, soft, ctx }) {
  const classeIds = _.isArray(classIds) ? classIds : [classIds];

  const programs = await Promise.all(
    _.map(classeIds, (classId) => getClassProgram({ id: classId, ctx }))
  );

  const classStudents = await ctx.tx.db.ClassStudent.find({ class: classeIds }).lean();
  if (!classStudents?.length) return;

  const promisesRemoveUserAgentsFromRooms = [];
  // Remove users from class room
  _.forEach(classeIds, (classId) => {
    const userIds = _.map(_.filter(classStudents, { class: classId }), 'student');
    promisesRemoveUserAgentsFromRooms.push(
      ctx.tx.call('comunica.room.removeUserAgents', {
        key: ctx.prefixPN(`room.class.${classId}`),
        userAgents: userIds, // TODO ask: Convención para parametros que empiezan con underscore, userAgents: _userAgents
      })
    );
  });
  _.forEach(classeIds, (classId) => {
    const userIds = _.map(_.filter(classStudents, { class: classId }), 'student');
    promisesRemoveUserAgentsFromRooms.push(
      ctx.tx.call('comunica.room.removeUserAgents', {
        key: ctx.prefixPN(`room.class.group.${classId}`),
        userAgents: userIds, // TODO ask: Convención para parametros que empiezan con underscore, userAgents: _userAgents
      })
    );
  });

  _.forEach(classeIds, (classId) => {
    const userIds = _.map(_.filter(classStudents, { class: classId }), 'student');
    _.forEach(userIds, (userId) => {
      promisesRemoveUserAgentsFromRooms.push(
        ctx.tx.call('comunica.room.removeAllUserAgents', {
          key: ctx.prefixPN(`room.class.${classId}.student.${userId}.teachers`),
        })
      );
    });
  });

  await Promise.all(promisesRemoveUserAgentsFromRooms);

  await ctx.tx.emit('before-remove-classes-students', { classStudents, soft });

  await ctx.tx.db.ClassStudent.deleteMany({ id: _.map(classStudents, 'id') }, { soft });

  const studentIds = _.map(classStudents, 'student');
  const promises = [];
  _.forEach(classeIds, (classId) => {
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
    classIds: classeIds,
    soft,
  });
  return true;
}

module.exports = { removeByClass };
