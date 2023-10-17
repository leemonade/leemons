const { map, difference, compact, uniq } = require('lodash');

const { sqlDatetime } = require('@leemons/utils');

const { searchInstancesByClass } = require('../../classes');

// TODO: Only add to assignable if student is on all the subjects of the assignableInstance

async function filterByOpenInstances({ instances, ctx }) {
  const autoAssignableInstances = await ctx.tx.db.Instances.find({
    id: instances,
    addNewClassStudents: true,
  })
    .select(['id'])
    .lean();

  const autoAssignableInstancesIds = map(autoAssignableInstances, 'id');

  const InstanceDates = await ctx.tx.db.Dates.find(
    {
      type: 'assignableInstance',
      instance: autoAssignableInstancesIds,
      $or: [
        {
          name: 'closed',
        },
        {
          name: 'deadline',
          date: {
            $lte: sqlDatetime(new Date().getTime() + 24 * 60 * 60 * 1000),
          },
        },
        {
          name: 'archived',
        },
      ],
    },
    { column: ['instance'] }
  );

  const expiredInstancesIds = map(InstanceDates, 'instance');

  const openInstances = difference(
    autoAssignableInstancesIds,
    expiredInstancesIds
  );

  return openInstances;
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

async function getInstancesClasses({ instances, ctx }) {
  const instancesClasses = await ctx.tx.db.Classes.find({
    assignableInstance: instances,
  })
    .select(['assignableInstance', 'class'])
    .lean();

  const instancesClassesObj = {};

  const classes = map(instancesClasses, 'class');
  const classesData = await ctx.tx.call(
    'academic-portfolio.classes.classByIds',
    {
      ids: classes,
      withTeachers: true,
    }
  );
  const classesById = {};
  classesData.forEach((classData) => {
    classesById[classData.id] = classData;
  });

  instancesClasses.forEach((instance) => {
    instancesClassesObj[instance.assignableInstance] =
      classesById[instance.class];
  });

  return instancesClassesObj;
}

async function grantUserAccessToEvens({ student, instances, ctx }) {
  const instancesWithEvents = await ctx.tx.db.Instances.find({ id: instances })
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

async function addStudentToInstances({ student, instances, ctx }) {
  // EN: Check if user is on the instances
  // ES: Comprobar si el usuario ya ha sido asignado
  const alreadyAssignedInstances = await getAlreadyAssignedInstances({
    student,
    instances,
    ctx,
  });
  const instancesToAssign = difference(instances, alreadyAssignedInstances);

  // EN: Add the student to all the instances
  // ES: Añadir los estudiantes a las instancias
  let assignations = await ctx.tx.db.Assignations.insertMany(
    instancesToAssign.map((instance) => ({
      instance,
      indexable: true,
      user: student,
      // TODO: Add user classes compatible to assignation
      classes: JSON.stringify([]),
    })),
    { lean: true }
  );

  // EN: Create the communica chats
  // ES: Crear los chats de comunica
  const classesByInstance = await getInstancesClasses({ instances, ctx });

  await Promise.all(
    assignations.map((assignation) => {
      const { instance } = assignation;
      const subjectId = classesByInstance[instance].subject.id;
      const teachers = classesByInstance[instance].teachers
        .filter((teacher) => teacher.type === 'main-teacher')
        .map((teacher) => teacher?.teacher?.id ?? teacher?.teacher);

      return ctx.tx.call('comunica.room.add', {
        key: ctx.prefixPN(
          `subject|${subjectId}.assignation|${assignation.id}.userAgent|${student}`
        ),
        userAgents: compact(uniq(teachers).concat(student)),
      });
    })
  );

  // EN: Grant users to access the events
  // ES: Da permiso a los usuarios para ver los eventos
  await grantUserAccessToEvens({ student, instances, ctx });
}

async function getMainTeacherUserSession({ klass, ctx }) {
  const teachers = await ctx.tx.call(
    'academic-portfolio.classes.teacherGetByClass',
    {
      classe: { id: klass },
      type: 'main-teacher',
      returnIds: true,
    }
  );

  const mainTeacher = teachers[0];

  return {
    userAgents: [
      {
        id: mainTeacher,
      },
    ],
  };
}

async function addStudentsToOpenInstancesWithClass({
  student,
  class: klass,
  ctx,
}) {
  const assignableInstances = await searchInstancesByClass({ id: klass, ctx });

  const openInstances = await filterByOpenInstances({
    instances: assignableInstances,
    ctx,
  });

  const userSession = await getMainTeacherUserSession({ klass, ctx });

  return await addStudentToInstances({
    student,
    instances: openInstances,
    ctx: { ...ctx, meta: { ...ctx.meta, userSession } },
  });
}

module.exports = { addStudentsToOpenInstancesWithClass };
