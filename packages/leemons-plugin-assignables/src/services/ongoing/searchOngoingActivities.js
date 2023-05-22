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

module.exports = async function searchOngoingActivities(query, { userSession, transacting } = {}) {
  // EN: Keep in mind we are working with 2 different resources: Assignations for students and Instances for teachers.
  // ES: Ten en mente que estamos trabajando con 2 recursos: Assignations para estudiantes e Instancias para profesores.
  const isTeacher = [true, 1, 'true'].includes(query?.isTeacher);
  /*
    === TEACHER ===
  */
  if (isTeacher) {
    let instances = await getTeacherInstances({ userSession, transacting });

    instances = filterInstancesByNotModule({ instances, filters: query });

    instances = filterInstancesByRoleAndQuery(
      { instances, filters: query },
      { userSession, transacting }
    );

    const instanceSubjectsProgramsAndClasses = await getInstanceSubjectsProgramsAndClasses(
      instances,
      {
        userSession,
        transacting,
      }
    );

    instances = filterInstancesByProgramAndSubjects({
      instances,
      filters: query,
      instanceSubjectsProgramsAndClasses,
    });

    const dates = await getActivitiesDates({ instances, filters: query }, { transacting });

    instances = filterInstancesByStatusAndArchived({ instances, filters: query, dates });

    return applyOffsetAndLimit(
      map(sortInstancesByDates({ instances, dates, filters: query }), 'id'),
      query
    );
  }

  /*
    === STUDENT ===
  */
  let assignations = await getStudentAssignations({ userSession, transacting });

  let instances = filterInstancesByRoleAndQuery({
    instances: map(assignations, 'instance'),
    filters: query,
  });

  instances = filterInstancesByNotModule({ instances, filters: query });

  const instanceSubjectsProgramsAndClasses = await getInstanceSubjectsProgramsAndClasses(
    instances,
    {
      userSession,
      transacting,
    }
  );

  instances = filterInstancesByProgramAndSubjects({
    instances,
    filters: query,
    instanceSubjectsProgramsAndClasses,
  });

  assignations = filterAssignationsByInstance({ assignations, instances });
  const dates = await getActivitiesDates(
    { instances, assignations, filters: { ...query, studentCanSee: true } },
    { transacting }
  );

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
  });

  instances = sortInstancesByDates({
    instances: map(assignations, 'instance'),
    dates,
    filters: query,
  });

  return applyOffsetAndLimit(uniq(map(instances, 'id')), query);
};
