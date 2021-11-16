const { programCanHaveCoursesOrHaveCourses } = require('./programCanHaveCoursesOrHaveCourses');
const { getProgramSubstages } = require('./getProgramSubstages');
const { removeProgramByIds } = require('./removeProgramByIds');
const { getProgramCourses } = require('./getProgramCourses');
const { programsByCenters } = require('./programsByCenters');
const { getProgramGroups } = require('./getProgramGroups');
const { programsByIds } = require('./programsByIds');

const { listPrograms } = require('./listPrograms');
const { addProgram } = require('./addProgram');

module.exports = {
  addProgram,
  listPrograms,
  programsByIds,
  getProgramGroups,
  programsByCenters,
  getProgramCourses,
  removeProgramByIds,
  getProgramSubstages,
  programCanHaveCoursesOrHaveCourses,
};
