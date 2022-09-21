const { map, difference } = require('lodash');
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
      ],
    },
    { column: ['instance', 'name', 'date'] }
  );

  const expiredInstancesIds = map(InstanceDates, 'instance');

  const openInstances = difference(autoAssignableInstancesIds, expiredInstancesIds);

  return openInstances;
}

async function addStudentToInstances({ student, instances, tries = 0, userSession }) {
  const assignationPromises = instances.map(async (instance) => {
    for (let createAssignationTries = 0; createAssignationTries < 3; createAssignationTries++) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const response = await leemons.plugin.services.assignations.createAssignation(
          instance,
          [student],
          { indexable: true },
          { userSession }
        );
        return response;
      } catch (e) {
        if (createAssignationTries === 2 || e.message.includes('already assigned')) {
          throw e;
        }
      }
    }

    return null;
  });

  try {
    return await Promise.all(assignationPromises);
  } catch (e) {
    if (e.message.includes('already assigned')) {
      return leemons.log.error(`Error assigning students to activities: ${e.message}`);
    }

    if (tries < 3) {
      return addStudentToInstances({ student, instances, try: tries + 1, userSession });
    }

    throw e;
  }
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
  const assignableInstances = await searchAssignableInstancesByClass(klass);

  const openInstances = await filterByOpenInstances(assignableInstances);

  const userSession = await getMainTeacherUserSession(klass);

  return addStudentToInstances({ student, instances: openInstances, userSession });
};
