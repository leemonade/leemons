const _ = require('lodash');
const { table } = require('../tables');

async function getProgramTreeTypes(programId, { transacting } = {}) {
  let program = null;
  if (_.isString(programId)) {
    program = await table.programs.findOne({ id: programId }, { transacting });
  } else {
    program = programId;
  }

  const haveCycles = await table.cycles.count({ program: program.id }, { transacting });

  // subject
  let result = [];
  switch (program.treeType) {
    case 2:
      result = ['center', 'program', 'courses', 'groups', 'knowledges', 'subjectType'];
      if (haveCycles) {
        result = ['center', 'program', 'cycles', 'courses', 'groups', 'knowledges', 'subjectType'];
      }
      break;
    case 3:
      result = ['center', 'program', 'courses', 'subjectType', 'knowledges'];
      if (haveCycles) {
        result = ['center', 'program', 'cycles', 'courses', 'subjectType', 'knowledges'];
      }
      break;
    case 4:
      result = ['center', 'program', 'subjectType', 'knowledges'];
      break;
    default:
      result = ['center', 'program', 'courses', 'groups', 'subjectType', 'knowledges'];
      if (haveCycles) {
        result = ['center', 'program', 'cycles', 'courses', 'groups', 'subjectType', 'knowledges'];
      }
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
