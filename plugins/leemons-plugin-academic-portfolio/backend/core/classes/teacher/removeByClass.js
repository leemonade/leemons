const _ = require('lodash');

const { getProfiles } = require('../../settings/getProfiles');
const { getClassProgram } = require('../getClassProgram');

const { removeCustomPermissions } = require('./removeCustomPermissions');

const REMOVE_CUSTOM_PERMISSION_USER_AGENT = 'users.permissions.removeCustomUserAgentPermission';

async function runIfComunicaRoomExists(key, callback, ctx) {
  const exists = await ctx.tx.call('comunica.room.exists', { key });
  if (exists) {
    return callback();
  }
}

async function removeByClass({
  classIds,
  soft,
  removeInvitedTeachers = false,
  teachersFilter,
  ctx,
}) {
  const classeIds = _.isArray(classIds) ? classIds : [classIds];

  const programs = await Promise.all(
    _.map(classeIds, (classId) => getClassProgram({ id: classId, ctx }))
  );

  const teacherQuery = {
    ...(removeInvitedTeachers ? {} : { type: { $ne: 'invited-teacher' } }), // Default behavior
    ...(teachersFilter ?? {}), // Target specific teachers by UserAgent or/and override default behavior
  };

  const classStudents = await ctx.tx.db.ClassStudent.find({
    class: classeIds,
  }).lean();
  const classTeachers = await ctx.tx.db.ClassTeacher.find({
    class: classeIds,
    ...teacherQuery,
  }).lean();
  if (!classTeachers?.length) return;

  const promisesRemoveUserAgentsFromRooms = [];

  // Remove users from class room
  _.forEach(classeIds, (classId) => {
    const userIds = _.map(_.filter(classTeachers, { class: classId }), 'teacher');
    const classRoomKey = ctx.prefixPN(`room.class.${classId}`);
    const classGroupRoomKey = ctx.prefixPN(`room.class.group.${classId}`);

    promisesRemoveUserAgentsFromRooms.push(
      runIfComunicaRoomExists(
        classRoomKey,
        () =>
          ctx.tx.call('comunica.room.removeUserAgents', {
            key: classRoomKey,
            userAgents: userIds,
          }),
        ctx
      )
    );

    promisesRemoveUserAgentsFromRooms.push(
      runIfComunicaRoomExists(
        classGroupRoomKey,
        () =>
          ctx.tx.call('comunica.room.removeUserAgents', {
            key: classGroupRoomKey,
            userAgents: userIds,
          }),
        ctx
      )
    );
  });

  if (classStudents?.length) {
    _.forEach(classeIds, (classId) => {
      const studentIds = _.map(_.filter(classStudents, { class: classId }), 'student');

      _.forEach(studentIds, (studentId) => {
        const studentTeacherRoomKey = ctx.prefixPN(
          `room.class.${classId}.student.${studentId}.teachers`
        );
        promisesRemoveUserAgentsFromRooms.push(
          runIfComunicaRoomExists(
            studentTeacherRoomKey,
            () =>
              ctx.tx.call('comunica.room.removeAllUserAgents', {
                key: studentTeacherRoomKey,
              }),
            ctx
          )
        );
      });
    });
  }

  try {
    await Promise.all(promisesRemoveUserAgentsFromRooms);
  } catch (error) {
    if (error.message.includes('not exists')) {
      console.warn(`Could not remove user agents from rooms: ${error}`);
    } else {
      throw error;
    }
  }

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
      ctx.tx.call(REMOVE_CUSTOM_PERMISSION_USER_AGENT, {
        userAgentId: classTeacher.teacher,
        data: {
          permissionName: `academic-portfolio.class.${classTeacher.class}`,
        },
      })
    )
  );

  // Permissions for the class main teacher (we don't check teacher type here, so they might not exist)
  try {
    await Promise.all(
      _.map(classTeachers, (classTeacher) =>
        ctx.tx.call(REMOVE_CUSTOM_PERMISSION_USER_AGENT, {
          userAgentId: classTeacher.teacher,
          data: {
            permissionName: `academic-portfolio.class.${classTeacher.class}.mainTeacher`,
          },
        })
      )
    );
  } catch (error) {
    console.warn(`Could not remove class main-teacher permissions: ${error}`);
  }

  await Promise.all(
    _.map(classTeachers, (classTeacher) =>
      ctx.tx.call(REMOVE_CUSTOM_PERMISSION_USER_AGENT, {
        userAgentId: classTeacher.teacher,
        data: {
          permissionName: `academic-portfolio.class-profile.${classTeacher.class}.${teacherProfileId}`,
        },
      })
    )
  );

  const teacherIds = _.map(classTeachers, 'teacher');
  const promises = [];
  _.forEach(classeIds, (classId) => {
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
    classIds: classeIds,
    soft,
  });
  return true;
}

module.exports = { removeByClass };
