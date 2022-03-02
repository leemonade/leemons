const { programCanHaveCoursesOrHaveCourses } = require('./programCanHaveCoursesOrHaveCourses');
const { duplicateProgramByIds } = require('./duplicateProgramByIds');
const { getProgramSubstages } = require('./getProgramSubstages');
const { removeProgramByIds } = require('./removeProgramByIds');
const { getProgramCourses } = require('./getProgramCourses');
const { programsByCenters } = require('./programsByCenters');
const { getProgramGroups } = require('./getProgramGroups');
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
  getProgramGroups,
  programsByCenters,
  getProgramCourses,
  removeProgramByIds,
  getProgramSubstages,
  duplicateProgramByIds,
  programCanHaveCoursesOrHaveCourses,
};
