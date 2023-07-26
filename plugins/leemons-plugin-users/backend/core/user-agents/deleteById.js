async function deleteById({ id, soft, ctx }) {
  return ctx.tx.db.UserAgent.delete({ id }, { soft, transacting });
}

module.exports = {
  deleteById,
};
