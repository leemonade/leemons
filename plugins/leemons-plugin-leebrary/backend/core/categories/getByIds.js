function getByIds({ categoriesIds, ctx }) {
  return ctx.tx.db.Categories.find({ id_$in: categoriesIds }).lean();
}

module.exports = { getByIds };
