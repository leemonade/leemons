async function query({ query: q, ctx }) {
  return ctx.tx.db.Config.find(q).lean();
}

module.exports = query;
