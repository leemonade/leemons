const { without, map } = require('lodash');
const {
  getTeacherInstances,
  getStudentAssignations,
  getActivitiesDates,
  getInstanceSubjectsProgramsAndClasses,
} = require('./helpers/activitiesData');
const {
  filterInstancesByStatusAndArchived,
  filterAssignationsByStudentDidOpen,
  filterAssignationsByDaysUntilDeadline,
  filterAssignationsByInstance,
  filterInstancesByProgramAndSubjects,
  filterInstancesByEvaluable,
  filterInstancesByNotModule,
} = require('./helpers/filters');
const {
  filterInstancesByStudentCompletionPercentage,
} = require('./helpers/filters/filterInstancesByStudentCompletionPercentage');
const { sortInstancesByDates, applyOffsetAndLimit } = require('./helpers/sorts');
const filterByBlockedActivities = require('./helpers/filters/filterByBlockedActivities');

module.exports = async function searchNyaActivities(query, { userSession, transacting } = {}) {
  // EN: Keep in mind we are working with 2 different resources: Assignations for students and Instances for teachers.
  // ES: Ten en mente que estamos trabajando con 2 recursos: Assignations para estudiantes e Instancias para profesores.
  const isTeacher = [true, 1, 'true'].includes(query?.isTeacher);

  /*
    === TEACHER ===
  */
  if (isTeacher) {
    let instances = await getTeacherInstances({ userSession, transacting });

    instances = filterInstancesByEvaluable({ instances, evaluable: true });

    instances = filterInstancesByNotModule({ instances });

    const dates = await getActivitiesDates(
      {
        instances,
        filters: {
          status: 'closed',
          sort: 'deadline',
          isArchived: false,
        },
      },
      { transacting }
    );

    const closedInstances = filterInstancesByStatusAndArchived({
      instances,
      filters: {
        status: 'closed',
        isArchived: false,
      },
      dates,
    });

    const openedInstances = without(instances, ...closedInstances);

    const instanceSubjectsProgramsAndClasses = await getInstanceSubjectsProgramsAndClasses(
      instances,
      { userSession, transacting }
    );

    const instancesWithStudentsWhoFinished = await filterInstancesByStudentCompletionPercentage(
      {
        instances: openedInstances,
        min: 0,
        max: 100,
        instanceSubjectsProgramsAndClasses,
        excludeStudentsFullyEvaluated: true,
      },
      { transacting }
    );

    const instancesToEvaluate = closedInstances.concat(instancesWithStudentsWhoFinished);

    const sortedInstances = sortInstancesByDates({
      instances: instancesToEvaluate,
      dates,
      filters: {
        sort: 'deadline',
      },
    });

    let instancesToReturn = filterInstancesByProgramAndSubjects({
      instances: sortedInstances,
      filters: query,
      instanceSubjectsProgramsAndClasses,
    });

    instancesToReturn = map(instancesToReturn, 'id');

    return applyOffsetAndLimit(instancesToReturn, query);
  }

  /*
    === STUDENT ===
  */
  let assignations = await getStudentAssignations({
    relatedInstances: true,
    userSession,
    transacting,
  });
  let instances = map(assignations, 'instance');

  instances = filterInstancesByNotModule({ instances });

  const dates = await getActivitiesDates(
    {
      assignations,
      instances,
      filters: {
        studentDidOpen: true,
        status: 'open',
        progress: 'notSubmitted',
        isArchived: false,
      },
    },
    { transacting }
  );

  instances = filterByBlockedActivities({ instances, assignations, dates });

  instances = filterInstancesByStatusAndArchived({
    instances,
    filters: {
      status: 'open',
      isArchived: false,
    },
    dates,
  });

  assignations = filterAssignationsByInstance({ assignations, instances });

  const newAssignations = filterAssignationsByStudentDidOpen({
    assignations,
    dates,
    filters: {
      studentDidOpen: false,
    },
  });

  assignations = without(assignations, ...newAssignations);

  const assignationsEndingNearby = filterAssignationsByDaysUntilDeadline({
    assignations,
    excludeFinished: true,
    dates,
    min: 0,
    max: 5,
  });

  let newInstances = map(newAssignations, 'instance');
  let instancesEndingNearby = map(assignationsEndingNearby, 'instance');

  newInstances = sortInstancesByDates({
    instances: newInstances,
    dates,
    filters: {
      sort: 'deadline',
    },
  });

  instancesEndingNearby = sortInstancesByDates({
    instances: instancesEndingNearby,
    dates,
    filters: {
      sort: 'deadline',
    },
  });

  let instancesToReturn = newInstances.concat(instancesEndingNearby);

  const instanceSubjectsProgramsAndClasses = await getInstanceSubjectsProgramsAndClasses(
    instancesToReturn,
    { userSession, transacting }
  );

  instancesToReturn = filterInstancesByProgramAndSubjects({
    instances: instancesToReturn,
    filters: query,
    instanceSubjectsProgramsAndClasses,
  });

  instancesToReturn = map(instancesToReturn, 'id');

  return applyOffsetAndLimit(instancesToReturn, query);
};
