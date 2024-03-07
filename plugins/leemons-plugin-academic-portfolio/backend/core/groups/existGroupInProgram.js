async function existGroupInProgram({ id, program, ctx }) {
  const count = await ctx.tx.db.Groups.countDocuments({ id, program, type: 'group' });
  return count > 0;
}

module.exports = { existGroupInProgram };
