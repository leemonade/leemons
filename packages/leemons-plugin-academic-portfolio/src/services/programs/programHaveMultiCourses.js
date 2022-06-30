const { table } = require('../tables');

async function programHaveMultiCourses(id, { transacting } = {}) {
  const program = await table.programs.findOne(
    { id },
    { columns: ['id', 'moreThanOneAcademicYear'], transacting }
  );

  return program.moreThanOneAcademicYear;
}

module.exports = { programHaveMultiCourses };
