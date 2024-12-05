const { map, keyBy } = require('lodash');

const { filterByInstanceDates } = require('../instances/searchInstances/filterByInstanceDates');

const {
  getTeacherInstances,
  getInstanceSubjectsProgramsAndClasses,
  getStudentAssignations,
  getActivitiesDates,
} = require('./helpers/activitiesData');
const {
  filterInstancesByRoleAndQuery,
  filterInstancesByProgramAndSubjects,
  filterInstancesByEvaluable,
  filterAssignationsByInstance,
  filterAssignationsByProgress,
} = require('./helpers/filters');
const { sortInstancesByDates, applyOffsetAndLimit } = require('./helpers/sorts');

async function searchInstances({ query, ctx }) {
  const isTeacher = [true, 1, 'true'].includes(query?.isTeacher);
  const isEvaluable = [true, 1, 'true'].includes(query?.isEvaluable);
  const calificableOnly = [true, 1, 'true'].includes(query?.calificableOnly);

  /*
    === Teacher ===
  */

  if (isTeacher) {
    let instances = await getTeacherInstances({ ctx });

    instances = filterInstancesByRoleAndQuery({ instances, filters: query });
    instances = filterInstancesByEvaluable({
      instances,
      evaluable: isEvaluable,
      calificableOnly,
    });

    const instanceSubjectsProgramsAndClasses = await getInstanceSubjectsProgramsAndClasses({
      instances,
      ctx,
    });
    instances = filterInstancesByProgramAndSubjects({
      instances,
      filters: query,
      instanceSubjectsProgramsAndClasses,
    });

    const instancesByIds = keyBy(instances, 'id');
    const instancesIds = await filterByInstanceDates({
      assignableInstancesIds: Object.keys(instancesByIds),
      query,
      ctx,
    });
    instances = map(instancesIds, (instanceId) => instancesByIds[instanceId]);

    instances = sortInstancesByDates({ instances });

    return applyOffsetAndLimit(map(instances, 'id'), query);
  }

  /*
    === Student ===
  */
  let assignations = await getStudentAssignations({ ctx });

  let instances = filterInstancesByRoleAndQuery({
    instances: map(assignations, 'instance'),
    filters: query,
  });

  instances = filterInstancesByEvaluable({
    instances,
    evaluable: isEvaluable,
    calificableOnly,
  });

  const instanceSubjectsProgramsAndClasses = await getInstanceSubjectsProgramsAndClasses({
    instances,
    ctx,
  });
  instances = filterInstancesByProgramAndSubjects({
    instances,
    filters: query,
    instanceSubjectsProgramsAndClasses,
  });

  assignations = filterAssignationsByInstance({
    assignations,
    instances,
  });

  const dates = await getActivitiesDates({
    instances,
    assignations,
    filters: { progress: true, sort: 'deadline' },
    ctx,
  });

  assignations = await filterAssignationsByProgress({
    assignations,
    dates,
    filters: {
      progress: ['notSubmitted', 'finished', 'evaluated'],
    },
    instanceSubjectsProgramsAndClasses,
    ctx,
  });

  instances = map(assignations, 'instance');

  const instancesByIds = keyBy(instances, 'id');
  const instancesIds = await filterByInstanceDates({
    assignableInstancesIds: Object.keys(instancesByIds),
    query,
    ctx,
  });

  instances = map(instancesIds, (instanceId) => instancesByIds[instanceId]);

  instances = sortInstancesByDates({ instances, dates, filters: { sort: 'deadline' } });

  return applyOffsetAndLimit(map(instances, 'id'), query);
}

module.exports = { searchInstances };
