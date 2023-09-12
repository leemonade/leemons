async function find({ query, columns, ctx }) {
  return ctx.tx.db.Assets.find(query).select(columns).lean();
}

module.exports = { find };
