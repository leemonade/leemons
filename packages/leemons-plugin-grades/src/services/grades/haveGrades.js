const { table } = require('../tables');

async function haveGrades({ transacting } = {}) {
  const grades = await table.grades.count({}, { transacting });
  console.log(grades);
  return !!grades;
}

module.exports = { haveGrades };
