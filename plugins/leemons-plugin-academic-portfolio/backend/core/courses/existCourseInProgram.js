const { isArray } = require('lodash');

async function existCourseInProgram({ id, program, ctx }) {
  const ids = isArray(id) ? id : [id];
  const count = await ctx.tx.db.Groups.countDocuments({ id: ids, program, type: 'course' });
  return count === ids.length;
}

module.exports = { existCourseInProgram };
