const { addProgram } = require('./addProgram');
const { addStudentsToClassesUnderNodeTree } = require('./addStudentsToClassesUnderNodeTree');
const { duplicateProgramByIds } = require('./duplicateProgramByIds');
const { filterProgramsByCenter } = require('./filterProgramsByCenter');
const { getAcademicTree } = require('./getAcademicTree');
const { getProgramCenters } = require('./getProgramCenters');
const { getProgramCourses } = require('./getProgramCourses');
const { getProgramCustomNomenclature } = require('./getProgramCustomNomenclature');
const { getProgramEvaluationSystem } = require('./getProgramEvaluationSystem');
const { getProgramGroups } = require('./getProgramGroups');
const { getProgramSubstages } = require('./getProgramSubstages');
const { getProgramTree } = require('./getProgramTree');
const { getUserPrograms } = require('./getUserPrograms');
const { getUsersInProgram } = require('./getUsersInProgram');
const { havePrograms } = require('./havePrograms');
const { isUserInsideProgram } = require('./isUserInsideProgram');
const { listPrograms } = require('./listPrograms');
const { programCanHaveCoursesOrHaveCourses } = require('./programCanHaveCoursesOrHaveCourses');
const { programHasSequentialCourses } = require('./programHasSequentialCourses');
const { programsByCenters } = require('./programsByCenters');
const { programsByIds } = require('./programsByIds');
const { removeProgramByIds } = require('./removeProgramByIds');
const { updateProgram } = require('./updateProgram');
const { updateProgramConfiguration } = require('./updateProgramConfiguration');
const { validateStaffChange } = require('./validateStaffChange');

module.exports = {
  addProgram,
  listPrograms,
  havePrograms,
  programsByIds,
  updateProgram,
  getProgramTree,
  getUserPrograms,
  getProgramGroups,
  getUsersInProgram,
  programsByCenters,
  getProgramCourses,
  getProgramCenters,
  removeProgramByIds,
  isUserInsideProgram,
  getProgramSubstages,
  duplicateProgramByIds,
  getProgramEvaluationSystem,
  addStudentsToClassesUnderNodeTree,
  programCanHaveCoursesOrHaveCourses,
  programHasSequentialCourses,
  updateProgramConfiguration,
  getAcademicTree,
  filterProgramsByCenter,
  getProgramCustomNomenclature,
  validateStaffChange,
};
