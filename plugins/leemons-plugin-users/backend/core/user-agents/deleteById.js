async function deleteById({ id, soft, ctx }) {
  return ctx.tx.db.UserAgent.findOneAndDelete({ id }, { soft });
}

module.exports = {
  deleteById,
};
