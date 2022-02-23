const { table } = require('../tables');

async function programHaveMultiCourses(id, { transacting } = {}) {
  const program = await table.programs.findOne(
    { id },
    { columns: ['moreThanOneAcademicYear'], transacting }
  );

  return program.moreThanOneAcademicYear;
}

module.exports = { programHaveMultiCourses };
