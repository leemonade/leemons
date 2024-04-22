const { map, keyBy } = require('lodash');

const {
  getTeacherInstances,
  getInstanceSubjectsProgramsAndClasses,
} = require('./helpers/activitiesData');
const {
  filterInstancesByRoleAndQuery,
  filterInstancesByProgramAndSubjects,
  filterInstancesByEvaluable,
} = require('./helpers/filters');
const { sortInstancesByDates, applyOffsetAndLimit } = require('./helpers/sorts');
const { filterByInstanceDates } = require('../instances/searchInstances/filterByInstanceDates');

async function searchInstances({ query, ctx }) {
  const isTeacher = [true, 1, 'true'].includes(query?.isTeacher);
  const isEvaluable = [true, 1, 'true'].includes(query?.isEvaluable);

  /*
    === Teacher ===
  */

  if (isTeacher) {
    let instances = await getTeacherInstances({ ctx });

    instances = filterInstancesByRoleAndQuery({ instances, filters: query });
    instances = filterInstancesByEvaluable({ instances, evaluable: isEvaluable });

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

  throw new Error('Not implemented for students');
}

module.exports = { searchInstances };
