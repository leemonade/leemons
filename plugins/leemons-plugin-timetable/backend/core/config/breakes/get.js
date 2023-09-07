module.exports = async function get({ configId, ctx }) {
  return ctx.tx.db.Breaks.find({ timetable: configId })
    .select(['id', 'start', 'end', 'name'])
    .lean();
};
