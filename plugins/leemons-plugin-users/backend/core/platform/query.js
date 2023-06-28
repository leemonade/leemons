async function query({ query: q, ctx }) {
  return ctx.t.db.Config.find(q).lean();
}

module.exports = query;
