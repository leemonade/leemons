/**
 * Status evaluated|late|submitted|closed
 * Start date
 * Deadline
 * Visualization
 * alwaysAvailable
 */
const _ = require('lodash');
const dayjs = require('dayjs');
const { getDates } = require('../dates');
const { assignableInstances, assignations, grades } = require('../tables');
const getUserPermissionMultiple = require('./permissions/assignableInstance/users/getUserPermissionMultiple');

function hasGrades(studentData) {
  const studentGrades = studentData?.grades;

  if (!studentGrades || !studentGrades.length) {
    return false;
  }

  return studentGrades.some((grade) => grade.visibleToStudent);
}

function getStatus(studentData, instanceData) {
  const startDate = dayjs(studentData?.timestamps?.start || null);
  const endDate = dayjs(studentData?.timestamps?.end || null);
  const instanceStartDate = dayjs(instanceData?.dates?.start || null);
  const deadline = dayjs(instanceData.dates?.deadline || null);
  const closeDate = dayjs(instanceData.dates?.closed || null);

  const endDateIsLate = endDate.isValid() && (endDate.isAfter(deadline) || endDate.isAfter(closeDate));
  const started =
    instanceData.alwaysAvailable ||
    (instanceStartDate.isValid() && !instanceStartDate.isAfter(dayjs()));
  const finished = deadline.isValid() && (!deadline.isAfter(dayjs()) || closeDate.isValid());

  if (finished || endDate.isValid()) {
    if (hasGrades(studentData)) {
      return 'evaluated'
    }

    if (endDateIsLate) {
      return 'late'
    }

    if (endDate.isValid()) {
      return 'submitted'
    }

    return 'closed'
  }

  if (started) {
    if (startDate.isValid()) {
      return 'started'
    }

    return 'opened'
  }

  return 'assigned'
}

module.exports = async function getAssignableInstancesStatus(
  assignableInstanceIds,
  { userSession, transacting }
) {
  const ids = _.uniq(
    Array.isArray(assignableInstanceIds) ? assignableInstanceIds : [assignableInstanceIds]
  );

  const statusObject = {};

  // EN: Get user permissions for each instance
  // ES: Obtener los permisos del usuario para cada instancia

  const permissions = await getUserPermissionMultiple(ids, { userSession, transacting });

  permissions.forEach((permission) => {
    if (!permission.actions.includes('view')) {
      throw new Error(
        `You do not have permissions to view the instance ${permission.assignableInstance}`
      );
    }
    const isTeacher = permission.actions.includes('edit');
    _.set(statusObject, `${permission.assignableInstance}.isTeacher`, isTeacher);
  });

  const promises = [];

  // EN: Get instance dates
  // ES: Obtener fechas de la instancia
  promises.push(
    getDates('assignableInstance', ids, { transacting }).then((instanceDates) => {
      Object.entries(instanceDates).map(([id, datesObject]) =>
        _.set(statusObject, `${id}.dates`, datesObject)
      );
    })
  );

  // EN: Get always available
  // ES: Obtener always available
  const getInstances = async () => {
    const instances = await assignableInstances.find(
      {
        id_$in: ids,
      },
      { columns: ['id', 'alwaysAvailable'], transacting }
    );

    instances.forEach(({ id, alwaysAvailable }) => {
      _.set(statusObject, `${id}.alwaysAvailable`, alwaysAvailable);
    });
  };

  promises.push(getInstances());

  // EN: Get assignations data
  // ES: Obtener datos de la asignación
  const assignationsQuery = ids.map((id) => {
    const query = {
      instance: id,
      user: userSession.userAgents[0].id,
    };

    return query;
  });

  const assignationsFound = await assignations.find(
    {
      $or: assignationsQuery,
    },
    { columns: ['instance', 'id', 'user'], transacting }
  );

  const assignationsObject = assignationsFound.reduce(
    (obj, assignation) => ({ ...obj, [assignation.id]: assignation }),
    {}
  );

  const promises2 = [];

  // DATES
  promises2.push(
    getDates('assignation', _.map(assignationsFound, 'id'), { transacting }).then(
      (assignationDates) => {
        Object.entries(assignationDates).map(([id, datesObject]) =>
          _.set(assignationsObject, `${id}.timestamps`, datesObject)
        );
      }
    )
  );

  // GRADES
  promises2.push(
    grades.find(
      {
        assignation_$in: _.map(assignationsFound, 'id'),
        type: 'main',
      },
      { columns: ['grade', 'visibleToStudent', 'subject', 'assignation'] }
    )
  );

  const [, gradesFound] = await Promise.all([...promises2, ...promises]);

  gradesFound.forEach((grade) => {
    if (!assignationsObject[grade.assignation]?.grades) {
      _.set(assignationsObject, `${grade?.assignation}.grades`, [grade]);
    } else {
      assignationsObject[grade?.assignation].grades.push(grade);
    }
  });

  assignationsFound.forEach(({ instance, id }) => {
    if (!statusObject[instance]?.assignations) {
      _.set(statusObject, `${instance}.assignations`, [assignationsObject[id]]);
    } else {
      statusObject[instance].assignations.push(assignationsObject[id]);
    }
  });

  return ids.flatMap((id) => {
    const instance = statusObject[id];

    if (instance.assignations) {
      return instance.assignations.map((assignation) => ({
        instance: id,
        assignation: assignation.id,
        status: getStatus(assignation, instance),
        dates: instance.dates || {},
        alwaysAvailable: instance.alwaysAvailable,
        timestamps: assignation.timestamps || {},
      }));
    }
    if (statusObject[id].isTeacher) {
      return [
        {
          instance: id,
          assignation: null,
          status: null,
          dates: instance.dates || {},
          alwaysAvailable: instance.alwaysAvailable,
          timestamps: null,
        },
      ];
    }
    return [];
  });
};
