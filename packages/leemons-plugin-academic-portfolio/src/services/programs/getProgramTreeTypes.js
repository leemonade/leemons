const { table } = require('../tables');

async function getProgramTreeTypes(programId, { transacting } = {}) {
  // subject
  const program = await table.programs.findOne({ id: programId }, { transacting });
  let result = [];
  switch (program.treeType) {
    case 2:
      result = ['center', 'program', 'courses', 'groups', 'knowledges', 'subjectType'];
      break;
    case 3:
      result = ['center', 'program', 'courses', 'subjectType', 'knowledges'];
      break;
    case 4:
      result = ['center', 'program', 'subjectType', 'knowledges'];
      break;
    default:
      result = ['center', 'program', 'courses', 'groups', 'subjectType', 'knowledges'];
      break;
  }
  if (program.moreThanOneAcademicYear) {
    const index = result.indexOf('courses');
    if (index >= 0) {
      result.splice(index, 1);
    }
  }
  return result;
}

module.exports = { getProgramTreeTypes };
