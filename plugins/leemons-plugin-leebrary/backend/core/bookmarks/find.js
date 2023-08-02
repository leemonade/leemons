async function find({ query, columns, ctx }) {
  return ctx.tx.db.Bookmarks.find(query).select(columns).lean();
}

module.exports = { find };
