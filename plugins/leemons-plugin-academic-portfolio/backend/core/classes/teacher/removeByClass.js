const _ = require('lodash');
const { getClassProgram } = require('../getClassProgram');
const { removeCustomPermissions } = require('./removeCustomPermissions');
const { getProfiles } = require('../../settings/getProfiles');

async function removeByClass({ classIds, soft, ctx }) {
  const classeIds = _.isArray(classIds) ? classIds : [classIds];

  const programs = await Promise.all(
    _.map(classeIds, (classId) => getClassProgram({ id: classId, ctx }))
  );

  const classStudents = await ctx.tx.db.ClassStudent.find({ class: classeIds }).lean();
  const classTeachers = await ctx.tx.db.ClassTeacher.find({ class: classeIds }).lean();

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

  _.forEach(classeIds, (classId) => {
    const studentIds = _.map(_.filter(classStudents, { class: classId }), 'student');
    const teacherIds = _.map(_.filter(classTeachers, { class: classId }), 'teacher');
    // TODO: Add this when comunica V2 is released
    /*
    _.forEach(studentIds, (studentId) => {
      promisesRemoveUserAgentsFromRooms.push(
        ctx.tx.call('comunica.room.removeUserAgents', {
          key: ctx.prefixPN(`room.class.${classId}.student.${studentId}.teachers`),
          userAgents: teacherIds, // TODO ask: Convención para parametros que empiezan con underscore, userAgents: _userAgents
        })
      );
    });
    */
  });

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
