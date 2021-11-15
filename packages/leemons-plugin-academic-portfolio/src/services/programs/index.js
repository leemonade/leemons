const { programCanHaveCoursesOrHaveCourses } = require('./programCanHaveCoursesOrHaveCourses');
const { getProgramSubstages } = require('./getProgramSubstages');
const { getProgramCourses } = require('./getProgramCourses');
const { programsByCenters } = require('./programsByCenters');
const { getProgramGroups } = require('./getProgramGroups');
const { programsByIds } = require('./programsByIds');
const { deleteProgram } = require('./deleteProgram');
const { listPrograms } = require('./listPrograms');
const { addProgram } = require('./addProgram');

module.exports = {
  addProgram,
  listPrograms,
  programsByIds,
  deleteProgram,
  getProgramGroups,
  programsByCenters,
  getProgramCourses,
  getProgramSubstages,
  programCanHaveCoursesOrHaveCourses,
};
