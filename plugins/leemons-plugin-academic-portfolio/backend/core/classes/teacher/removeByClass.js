const _ = require('lodash');

const { getProfiles } = require('../../settings/getProfiles');
const { getClassProgram } = require('../getClassProgram');

const { removeCustomPermissions } = require('./removeCustomPermissions');

async function removeByClass({ classIds, soft, removeInvitedTeachers = false, ctx }) {
  const classeIds = _.isArray(classIds) ? classIds : [classIds];

  const programs = await Promise.all(
    _.map(classeIds, (classId) => getClassProgram({ id: classId, ctx }))
  );

  const classStudents = await ctx.tx.db.ClassStudent.find({
    class: classeIds,
  }).lean();
  const classTeachers = await ctx.tx.db.ClassTeacher.find({
    class: classeIds,
    ...(removeInvitedTeachers ? {} : { type: { $ne: 'invited-teacher' } }),
  }).lean();
  if (!classTeachers?.length) return;

  const promisesRemoveUserAgentsFromRooms = [];
  // Remove users from class room
  _.forEach(classeIds, (classId) => {
    const userIds = _.map(_.filter(classTeachers, { class: classId }), 'teacher');
    promisesRemoveUserAgentsFromRooms.push(
      ctx.tx.call('comunica.room.removeUserAgents', {
        key: ctx.prefixPN(`room.class.${classId}`),
        userAgents: userIds, // TODO ask: Convención para parametros que empiezan con underscore, userAgents: _userAgents
      })
    );
  });

  _.forEach(classeIds, (classId) => {
    const userIds = _.map(_.filter(classTeachers, { class: classId }), 'teacher');
    promisesRemoveUserAgentsFromRooms.push(
      ctx.tx.call('comunica.room.removeUserAgents', {
        key: ctx.prefixPN(`room.class.group.${classId}`),
        userAgents: userIds, // TODO ask: Convención para parametros que empiezan con underscore, userAgents: _userAgents
      })
    );
  });

  if (classStudents?.length) {
    _.forEach(classeIds, (classId) => {
      const studentIds = _.map(_.filter(classStudents, { class: classId }), 'student');

      _.forEach(studentIds, (studentId) => {
        promisesRemoveUserAgentsFromRooms.push(
          ctx.tx.call('comunica.room.removeAllUserAgents', {
            key: ctx.prefixPN(`room.class.${classId}.student.${studentId}.teachers`),
          })
        );
      });
    });
  }

  await Promise.all(promisesRemoveUserAgentsFromRooms);

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

  await Promise.all(
    _.map(classTeachers, (classTeacher) =>
      ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
        userAgentId: classTeacher.teacher,
        data: {
          permissionName: `academic-portfolio.class.${classTeacher.class}`,
        },
      })
    )
  );

  await Promise.all(
    _.map(classTeachers, (classTeacher) =>
      ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
        userAgentId: classTeacher.teacher,
        data: {
          permissionName: `academic-portfolio.class-profile.${classTeacher.class}.${teacherProfileId}`,
        },
      })
    )
  );

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
