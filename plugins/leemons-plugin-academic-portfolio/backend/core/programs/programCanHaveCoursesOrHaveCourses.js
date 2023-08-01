const _ = require('lodash');
const { table } = require('../tables');
const { getProgramCourses } = require('./getProgramCourses');

async function programCanHaveCoursesOrHaveCourses(id, { transacting } = {}) {
  const program = await table.programs.findOne(
    { id },
    { columns: ['id', 'maxNumberOfCourses'], transacting }
  );
  if (program.maxNumberOfCourses > 1) {
    return true;
  }

  const courses = await getProgramCourses(id, { transacting });
  if (courses.length > 1) {
    return true;
  }
  return false;
}

module.exports = { programCanHaveCoursesOrHaveCourses };
