const { LeemonsError } = require('@leemons/error');

async function remove({ category, ctx }) {
  const { key } = category;

  try {
    return await ctx.tx.db.Categories.deleteMany({ key });
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to remove category: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { remove };
