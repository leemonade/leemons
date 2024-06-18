const { map } = require('lodash');
const {
  getStudentAssignations,
  getInstanceSubjectsProgramsAndClasses,
  getActivitiesDates,
} = require('./helpers/activitiesData');
const {
  filterInstancesByNotModule,
  filterInstancesByProgramAndSubjects,
  filterAssignationsByInstance,
  filterAssignationsByProgress,
} = require('./helpers/filters');
const { filterInstancesByIsModule } = require('./helpers/filters/filterInstancesByIsModule');
const { sortInstancesByDates, applyOffsetAndLimit } = require('./helpers/sorts');
const { groupInstancesInModules } = require('./helpers/filters/groupInstancesInModules');
const { returnModulesData } = require('./helpers/filters/returnModulesData');
const {
  filterModuleInstancesByHavingAllActivities,
} = require('./helpers/filters/filterModuleInstancesByHavingAllActivities');
const filterAssignationsByGradesNotViewed = require('./helpers/filters/filterAssignationsByGradesNotViewed');

/**
 *
 * @param {Object} param0
 * @param {Object} param0.query
 * @param {string} param0.query.program
 * @param {string} param0.query.subject
 * @param {Object} param0.ctx
 */
module.exports = async function searchEvaluatedActivities({ query, ctx }) {
  let assignations = await getStudentAssignations({ ctx });
  let instances = map(assignations, 'instance');

  let modules = filterInstancesByIsModule({ instances });
  let modulesAssignations = filterAssignationsByInstance({ assignations, instances: modules });

  instances = filterInstancesByNotModule({ instances });

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
    assignations: assignations.concat(modulesAssignations),
    filters: { progress: 'evaluated', gradeWasViewed: true },
    ctx,
  });

  assignations = await filterAssignationsByProgress({
    assignations,
    filters: { progress: 'evaluated' },
    dates,
    instanceSubjectsProgramsAndClasses,
    includeNonEvaluableChildren: true,
    ctx,
  });

  assignations = filterAssignationsByGradesNotViewed({ assignations, dates });
  modulesAssignations = filterAssignationsByGradesNotViewed({
    assignations: modulesAssignations,
    dates,
  });
  modules = map(modulesAssignations, 'instance');

  instances = groupInstancesInModules({ instances: map(assignations, 'instance'), modules });
  instances = filterModuleInstancesByHavingAllActivities({ instances });

  instances = sortInstancesByDates({
    instances,
    filters: query,
  });

  const paginatedData = applyOffsetAndLimit(instances, query);
  return returnModulesData({ paginatedData, filters: query });
};
