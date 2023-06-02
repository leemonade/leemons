async function detail({ _id, ctx }) {
  return ctx.tx.db.Centers.findOne({ _id }).lean();
}

module.exports = detail;
