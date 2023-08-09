const _ = require('lodash');

async function getProgramTreeTypes({ programId, ctx }) {
  let program = null;

  if (_.isString(programId)) {
    program = await ctx.tx.db.Programs.findOne({ id: programId }).lean();
  } else {
    program = programId;
  }

  const haveCycles = await ctx.tx.db.Cycles.countDocuments({ program: program.id });

  // subject
  let result = [];

  // Determine the program tree types based on the program's treeType value.
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

  // If the program lasts more than one academic year, remove 'courses' from the tree types.
  if (program.moreThanOneAcademicYear) {
    const index = result.indexOf('courses');
    if (index >= 0) {
      result.splice(index, 1);
    }
  }
  return result;
}

module.exports = { getProgramTreeTypes };
