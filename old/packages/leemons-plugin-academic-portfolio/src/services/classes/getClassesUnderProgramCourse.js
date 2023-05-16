const _ = require('lodash');
const { table } = require('../tables');

async function getClassesUnderProgramCourse(program, course, { transacting } = {}) {
  const programs = _.isArray(program) ? program : [program];
  // eslint-disable-next-line no-nested-ternary
  const courses = course ? (_.isArray(course) ? course : [course]) : null;
  const classes = await table.class.find(
    { program_$in: programs },
    { columns: ['id'], transacting }
  );
  const classIds = _.map(classes, 'id');
  const classCourses = await table.classCourse.find(
    {
      class_$in: classIds,
      course_$in: courses,
    },
    { columns: ['class'], transacting }
  );
  return _.map(classCourses, 'class');
}

module.exports = { getClassesUnderProgramCourse };
