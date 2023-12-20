const { uniq, map } = require('lodash');

const {
  getActivitiesDates,
  getInstanceSubjectsProgramsAndClasses,
  getStudentAssignations,
  getTeacherInstances,
} = require('./helpers/activitiesData');
const {
  filterAssignationsByInstance,
  filterAssignationsByProgress,
  filterInstancesByProgramAndSubjects,
  filterInstancesByRoleAndQuery,
  filterInstancesByStatusAndArchived,
  filterInstancesByNotModule,
} = require('./helpers/filters');
const { applyOffsetAndLimit, sortInstancesByDates } = require('./helpers/sorts');

/*
  === Main function ===
*/

/**
 * This function is used to search ongoing activities.
 * @async
 * @function searchOngoingActivities
 * @param {Object} params - The parameters for the function.
 * @param {Object} params.query - The query parameters.
 * @param {Moleculer.Context} params.ctx - The Moleculer context.
 * @returns {Promise<Array>} A promise that resolves to an array of ongoing activities.
 */
module.exports = async function searchOngoingActivities({ query, ctx }) {
  // EN: Keep in mind we are working with 2 different resources: Assignations for students and Instances for teachers.
  // ES: Ten en mente que estamos trabajando con 2 recursos: Assignations para estudiantes e Instancias para profesores.
  const isTeacher = [true, 1, 'true'].includes(query?.isTeacher);
  /*
          === TEACHER ===
        */
  if (isTeacher) {
    let instances = await getTeacherInstances({ ctx });

    instances = filterInstancesByNotModule({ instances, filters: query });

    instances = filterInstancesByRoleAndQuery({ instances, filters: query });

    const instanceSubjectsProgramsAndClasses = await getInstanceSubjectsProgramsAndClasses({
      instances,
      ctx,
    });

    instances = filterInstancesByProgramAndSubjects({
      instances,
      filters: query,
      instanceSubjectsProgramsAndClasses,
    });

    const dates = await getActivitiesDates({ instances, filters: query, ctx });

    instances = filterInstancesByStatusAndArchived({ instances, filters: query, dates });

    return applyOffsetAndLimit(
      map(sortInstancesByDates({ instances, dates, filters: query }), 'id'),
      query
    );
  }

  /*
    === STUDENT ===
  */
  let assignations = await getStudentAssignations({ ctx });

  let instances = filterInstancesByRoleAndQuery({
    instances: map(assignations, 'instance'),
    filters: query,
  });

  instances = filterInstancesByNotModule({ instances, filters: query });

  const instanceSubjectsProgramsAndClasses = await getInstanceSubjectsProgramsAndClasses({
    instances,
    ctx,
  });

  instances = filterInstancesByProgramAndSubjects({
    instances,
    filters: query,
    instanceSubjectsProgramsAndClasses,
  });

  assignations = filterAssignationsByInstance({ assignations, instances });
  const dates = await getActivitiesDates({
    instances,
    assignations,
    filters: { ...query, studentCanSee: true },
    ctx,
  });

  instances = filterInstancesByStatusAndArchived({
    instances,
    filters: query,
    dates,
    hideNonVisible: true,
  });
  assignations = filterAssignationsByInstance({ assignations, instances });

  assignations = await filterAssignationsByProgress({
    assignations,
    dates,
    filters: query,
    instanceSubjectsProgramsAndClasses,
    ctx,
  });

  instances = sortInstancesByDates({
    instances: map(assignations, 'instance'),
    dates,
    filters: query,
  });

  return applyOffsetAndLimit(uniq(map(instances, 'id')), query);
};
