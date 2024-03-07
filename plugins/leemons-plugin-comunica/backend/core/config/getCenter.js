async function getCenter({ center, ctx }) {
  const item = await ctx.tx.db.Config.findOne({ type: 'center', typeId: center }).lean();
  let config = {
    studentsCanAddTeachersToGroups: true,
  };
  if (item) {
    config = JSON.parse(item.config || null);
  }
  return config;
}

module.exports = { getCenter };
