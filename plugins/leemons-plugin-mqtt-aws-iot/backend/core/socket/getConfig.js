async function getConfig({ ctx }) {
  return ctx.tx.db.Config.findOne({}).lean();
}

module.exports = { getConfig };
