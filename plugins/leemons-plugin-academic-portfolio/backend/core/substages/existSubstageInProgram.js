const _ = require('lodash');

async function existSubstageInProgram({ id, program, ctx }) {
  const ids = _.isArray(id) ? id : [id];
  const count = await ctx.tx.db.Groups.countDocuments({ id: ids, program, type: 'substage' });
  return count === ids.length;
}

module.exports = { existSubstageInProgram };
