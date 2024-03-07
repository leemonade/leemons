async function detail({ id, ctx }) {
  return ctx.tx.db.Centers.findOne({ id }).lean();
}

module.exports = detail;
