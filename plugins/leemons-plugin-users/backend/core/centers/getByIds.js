async function getByIds({ ids, ctx }) {
  return ctx.tx.db.Centers.find({ id: ids }).lean();
}

module.exports = { getByIds };
