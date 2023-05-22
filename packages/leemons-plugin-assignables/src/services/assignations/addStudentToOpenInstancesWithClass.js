const { map, difference, compact, uniq } = require('lodash');
const { searchAssignableInstancesByClass } = require('../classes');
const tables = require('../tables');

// TODO: Only add to assignable if student is on all the subjects of the assignableInstance

async function filterByOpenInstances(instances) {
  const autoAssignableInstances = await tables.assignableInstances.find(
    {
      id_$in: instances,
      addNewClassStudents: true,
    },
    { column: ['id'] }
  );

  const autoAssignableInstancesIds = map(autoAssignableInstances, 'id');

  const InstanceDates = await tables.dates.find(
    {
      type: 'assignableInstance',
      instance_$in: autoAssignableInstancesIds,
      $or: [
        {
          name: 'closed',
        },
        {
          name: 'deadline',
          date_$lte: global.utils.sqlDatetime(new Date().getTime() + 24 * 60 * 60 * 1000),
        },
        {
          name: 'archived',
        },
      ],
    },
    { column: ['instance'] }
  );

  const expiredInstancesIds = map(InstanceDates, 'instance');

  const openInstances = difference(autoAssignableInstancesIds, expiredInstancesIds);

  return openInstances;
}

async function getAlreadyAssignedInstances({ student, instances }) {
  const assignationsFound = await tables.assignations.find(
    {
      instance_$in: instances,
      user: student,
    },
    { columns: ['instance'] }
  );

  return assignationsFound.map((assignation) => assignation.instance);
}

async function getInstancesClasses({ instances, userSession }) {
  const academicPortfolioServices = leemons.getPlugin('academic-portfolio').services;

  const instancesClasses = await tables.classes.find(
    {
      assignableInstance_$in: instances,
    },
    { columns: ['assignableInstance', 'class'] }
  );

  const instancesClassesObj = {};

  const classes = map(instancesClasses, 'class');
  const classesData = await academicPortfolioServices.classes.classByIds(classes, {
    withTeachers: true,
    userSession,
  });
  const classesById = {};
  classesData.forEach((classData) => {
    classesById[classData.id] = classData;
  });

  instancesClasses.forEach((instance) => {
    instancesClassesObj[instance.assignableInstance] = classesById[instance.class];
  });

  return instancesClassesObj;
}

async function grantUserAccessToEvens({ student, instances, transacting }) {
  const instancesWithEvents = await tables.assignableInstances.find(
    { id_$in: instances },
    { column: ['event'] }
  );
  const calendarServices = leemons.getPlugin('calendar').services.calendar;

  await Promise.all(
    instancesWithEvents.map(({ event }) =>
      calendarServices.grantAccessUserAgentToEvent(event, [student], 'view', {
        transacting,
      })
    )
  );
}

async function addStudentToInstances({ student, instances, userSession }) {
  return global.utils.withTransaction(async (transacting) => {
    // EN: Check if user is on the instances
    // ES: Comprobar si el usuario ya ha sido asignado
    const alreadyAssignedInstances = await getAlreadyAssignedInstances({ student, instances });
    const instancesToAssign = difference(instances, alreadyAssignedInstances);

    // EN: Add the student to all the instances
    // ES: Añadir los estudiantes a las instancias
    const assignations = await tables.assignations.createMany(
      instancesToAssign.map((instance) => ({
        instance,
        indexable: true,
        user: student,
        // TODO: Add user classes compatible to assignation
        classes: JSON.stringify([]),
      })),
      { transacting }
    );

    // EN: Create the communica chats
    // ES: Crear los chats de comunica
    const comunicaServices = leemons.getPlugin('comunica').services;
    const classesByInstance = await getInstancesClasses({ instances, userSession });

    await Promise.all(
      assignations.map((assignation) => {
        const { instance } = assignation;
        const subjectId = classesByInstance[instance].subject.id;
        const teachers = classesByInstance[instance].teachers
          .filter((teacher) => teacher.type === 'main-teacher')
          .map((teacher) => teacher?.teacher?.id ?? teacher?.teacher);

        return comunicaServices.room.add(
          leemons.plugin.prefixPN(
            `subject|${subjectId}.assignation|${assignation.id}.userAgent|${student}`
          ),
          {
            userSession,
            transacting,
            userAgents: compact(uniq(teachers).concat(student)),
          }
        );
      })
    );

    // EN: Grant users to access the events
    // ES: Da permiso a los usuarios para ver los eventos
    await grantUserAccessToEvens({ student, instances, transacting });
  }, tables.assignations);
}

async function getMainTeacherUserSession(klass) {
  const teachers = await leemons
    .getPlugin('academic-portfolio')
    .services.classes.teacher.getByClass(
      { id: klass },
      {
        type: 'main-teacher',
        returnIds: true,
      }
    );

  const mainTeacher = teachers[0];

  const userSession = {
    userAgents: [
      {
        id: mainTeacher,
      },
    ],
  };

  return userSession;
}

module.exports = async function addStudentsToOpenInstancesWithClass({ student, class: klass }) {
  const start = Date.now();

  const assignableInstances = await searchAssignableInstancesByClass(klass);

  const openInstances = await filterByOpenInstances(assignableInstances);

  const userSession = await getMainTeacherUserSession(klass);

  const result = await addStudentToInstances({ student, instances: openInstances, userSession });

  leemons.log.debug(
    global.utils
      .chalk`{cyan [addStudents]} Student {green ${student}} add to {red ${klass}} activities in {gray ${
      start - Date.now()
    }ms}`
  );

  return result;
};
