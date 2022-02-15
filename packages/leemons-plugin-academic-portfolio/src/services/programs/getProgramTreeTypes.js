const { table } = require('../tables');

async function getProgramTreeTypes(programId, { transacting } = {}) {
  // subject
  const program = await table.programs.findOne({ id: programId }, { transacting });
  switch (program.treeType) {
    case 2:
      return ['center', 'program', 'courses', 'groups', 'knowledges', 'subjectType'];
    case 3:
      return ['center', 'program', 'courses', 'subjectType', 'knowledges'];
    case 4:
      return ['center', 'program', 'subjectType', 'knowledges'];
    default:
      return ['center', 'program', 'courses', 'groups', 'subjectType', 'knowledges'];
  }
}

module.exports = { getProgramTreeTypes };
