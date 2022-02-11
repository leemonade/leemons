const { table } = require('../tables');

async function getProgramTreeTypes(programId, { transacting } = {}) {
  const program = await table.programs.findOne({ id: programId }, { transacting });
  switch (program.treeType) {
    case 2:
      return ['center', 'program', 'courses', 'groups', 'knowledges', 'subjectType', 'subject'];
    case 3:
      return ['center', 'program', 'courses', 'subjectType', 'knowledges', 'subject'];
    case 4:
      return ['center', 'program', 'subjectType', 'knowledges', 'subject'];
    default:
      return ['center', 'program', 'courses', 'groups', 'subjectType', 'knowledges', 'subject'];
  }
}

module.exports = { getProgramTreeTypes };
