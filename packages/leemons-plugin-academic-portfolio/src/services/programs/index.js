const { programCanHaveCoursesOrHaveCourses } = require('./programCanHaveCoursesOrHaveCourses');
const { addStudentsToClassesUnderNodeTree } = require('./addStudentsToClassesUnderNodeTree');
const { duplicateProgramByIds } = require('./duplicateProgramByIds');
const { getProgramSubstages } = require('./getProgramSubstages');
const { isUserInsideProgram } = require('./isUserInsideProgram');
const { removeProgramByIds } = require('./removeProgramByIds');
const { getProgramCourses } = require('./getProgramCourses');
const { programsByCenters } = require('./programsByCenters');
const { getProgramGroups } = require('./getProgramGroups');
const { getUserPrograms } = require('./getUserPrograms');
const { getProgramTree } = require('./getProgramTree');
const { programsByIds } = require('./programsByIds');
const { updateProgram } = require('./updateProgram');
const { listPrograms } = require('./listPrograms');
const { havePrograms } = require('./havePrograms');
const { addProgram } = require('./addProgram');

module.exports = {
  addProgram,
  listPrograms,
  havePrograms,
  programsByIds,
  updateProgram,
  getProgramTree,
  getUserPrograms,
  getProgramGroups,
  programsByCenters,
  getProgramCourses,
  removeProgramByIds,
  isUserInsideProgram,
  getProgramSubstages,
  duplicateProgramByIds,
  addStudentsToClassesUnderNodeTree,
  programCanHaveCoursesOrHaveCourses,
};
