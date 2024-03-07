const _ = require('lodash');

async function getClassesUnderProgram({ program, ctx }) {
  const programs = _.isArray(program) ? program : [program];
  const classes = await ctx.tx.db.Class.find({ program: programs }).select(['id']).lean();
  return _.map(classes, 'id');
}

module.exports = { getClassesUnderProgram };
