const { sqlDatetime } = require('@leemons/utils');
const { map, difference, compact, uniq } = require('lodash');

const { searchInstancesByClass } = require('../../classes');
const { addPermissionToUser } = require('../../permissions/instances/users');
const { createAssignation } = require('../createAssignation');

// TODO: Only add to assignable if student is on all the subjects of the assignableInstance

async function filterByOpenInstances({ instances, ctx }) {
  const autoAssignableInstances = await ctx.tx.db.Instances.find({
    id: instances,
    addNewClassStudents: true,
  })
    .select(['id'])
    .lean();

  const autoAssignableInstancesIds = map(autoAssignableInstances, 'id');

  const InstanceDates = await ctx.tx.db.Dates.find({
    type: 'assignableInstance',
    instance: autoAssignableInstancesIds,
    $or: [
      {
        name: 'closed',
      },
      {
        name: 'deadline',
        date: {
          $lte: new Date(),
        },
      },
      {
        name: 'archived',
      },
    ],
    date: {
      $ne: null,
    },
  })
    .select(['instance'])
    .lean();

  const expiredInstancesIds = map(InstanceDates, 'instance');

  return difference(autoAssignableInstancesIds, expiredInstancesIds);
}

async function getAlreadyAssignedInstances({ student, instances, ctx }) {
  const assignationsFound = await ctx.tx.db.Assignations.find({
    instance: instances,
    user: student,
  })
    .select(['instance'])
    .lean();

  return assignationsFound.map((assignation) => assignation.instance);
}

async function grantUserAccessToEvens({ student, instances, ctx }) {
  const instancesWithEvents = await ctx.tx.db.Instances.find({
    id: instances,
    event: { $ne: null },
  })
    .select(['event'])
    .lean();

  await Promise.all(
    instancesWithEvents.map(({ event }) =>
      ctx.tx.call('calendar.calendar.grantAccessUserAgentToEvent', {
        id: event,
        userAgentId: [student],
        actionName: 'view',
      })
    )
  );
}

async function getInstancesAssignables({ instances, ctx }) {
  const instancesResults = await ctx.tx.db.Instances.find({
    id: instances,
  })
    .select({ id: 1, assignable: 1 })
    .lean();

  return instancesResults.reduce((acc, instance) => {
    acc[instance.id] = instance.assignable;
    return acc;
  }, {});
}

async function addStudentToInstance({ student, instance, assignable, ctx }) {
  await addPermissionToUser({
    assignableInstance: instance,
    assignable: assignable.id,
    userAgents: [student],
    role: 'student',
    ctx,
  });

  await createAssignation({
    assignableInstanceId: instance,
    users: [student],
    options: { indexable: false },
    ctx,
  });
}

async function addStudentToInstances({ student, instances, ctx }) {
  // EN: Check if user is on the instances
  // ES: Comprobar si el usuario ya ha sido asignado
  const alreadyAssignedInstances = await getAlreadyAssignedInstances({
    student,
    instances,
    ctx,
  });
  const instancesToAssign = difference(instances, alreadyAssignedInstances);

  const assignablesByInstance = await getInstancesAssignables({
    instances: instancesToAssign,
    ctx,
  });

  // EN: Add the student to all the instances
  // ES: Añadir los estudiantes a las instancias
  await Promise.all(
    instancesToAssign.map(async (instance) => {
      await addStudentToInstance({
        student,
        instance,
        assignable: assignablesByInstance[instance],
        ctx,
      });
    })
  );

  // EN: Grant users to access the events
  // ES: Da permiso a los usuarios para ver los eventos
  await grantUserAccessToEvens({ student, instances, ctx });
}

async function getMainTeacherUserSession({ klass, ctx }) {
  const teachers = await ctx.tx.call('academic-portfolio.classes.teacherGetByClass', {
    classe: { id: klass },
    type: 'main-teacher',
    returnIds: true,
  });

  const mainTeacher = teachers[0];

  const [{ user }] = await ctx.tx.call('users.users.getUserAgentsInfo', {
    userAgentIds: [mainTeacher],
    withProfile: true,
    withCenter: true,
  });

  return {
    ...user,
    userAgents: [
      {
        id: mainTeacher,
      },
    ],
  };
}

async function addStudentsToOpenInstancesWithClass({ student, class: klass, ctx }) {
  const assignableInstances = await searchInstancesByClass({ id: klass, ctx });

  const openInstances = await filterByOpenInstances({
    instances: assignableInstances,
    ctx,
  });

  if (!openInstances.length) {
    return;
  }

  const userSession = await getMainTeacherUserSession({ klass, ctx });

  return await addStudentToInstances({
    student,
    instances: openInstances,
    ctx: { ...ctx, meta: { ...ctx.meta, userSession } },
  });
}

module.exports = { addStudentsToOpenInstancesWithClass };
