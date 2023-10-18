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
/**
 * This function is used to search Nya activities.
 * @async
 * @function searchNyaActivities
 * @param {Object} params - The parameters for the function.
 * @param {Object} params.query - The query parameters.
 * @param {Moleculer.Context} params.ctx - The Moleculer context.
 * @returns {Promise<Array>} A promise that resolves to an array of Nya activities.
 */

module.exports = async function searchNyaActivities({ query, ctx }) {
  // EN: Keep in mind we are working with 2 different resources: Assignations for students and Instances for teachers.
  // ES: Ten en mente que estamos trabajando con 2 recursos: Assignations para estudiantes e Instancias para profesores.
  const isTeacher = [true, 1, 'true'].includes(query?.isTeacher);

  /*
    === TEACHER ===
  */
  if (isTeacher) {
    let instances = await getTeacherInstances({ ctx });

    instances = filterInstancesByEvaluable({ instances, evaluable: true });

    instances = filterInstancesByNotModule({ instances });

    const dates = await getActivitiesDates({
      instances,
      filters: {
        status: 'closed',
        sort: 'deadline',
        isArchived: false,
      },
      ctx,
    });

    const closedInstances = filterInstancesByStatusAndArchived({
      instances,
      filters: {
        status: 'closed',
        isArchived: false,
      },
      dates,
    });

    const openedInstances = without(instances, ...closedInstances);

    const instanceSubjectsProgramsAndClasses = await getInstanceSubjectsProgramsAndClasses({
      instances,
      ctx,
    });

    const instancesWithStudentsWhoFinished = await filterInstancesByStudentCompletionPercentage({
      instances: openedInstances,
      min: 0,
      max: 100,
      instanceSubjectsProgramsAndClasses,
      excludeStudentsFullyEvaluated: true,
      ctx,
    });

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
    ctx,
  });
  let instances = map(assignations, 'instance');

  instances = filterInstancesByNotModule({ instances });

  const dates = await getActivitiesDates({
    assignations,
    instances,
    filters: {
      studentDidOpen: true,
      status: 'open',
      progress: 'notSubmitted',
      isArchived: false,
    },
    ctx,
  });

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

  const instanceSubjectsProgramsAndClasses = await getInstanceSubjectsProgramsAndClasses({
    instances: instancesToReturn,
    ctx,
  });

  instancesToReturn = filterInstancesByProgramAndSubjects({
    instances: instancesToReturn,
    filters: query,
    instanceSubjectsProgramsAndClasses,
  });

  instancesToReturn = map(instancesToReturn, 'id');

  return applyOffsetAndLimit(instancesToReturn, query);
};
