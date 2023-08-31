/**
 *
 * @param {object} options
 * @param {string} options.type
 * @param {string} options.instance
 * @param {string|string[]} options.name
 * @param {object} options.ctx
 * @returns
 */
async function unregisterDates({ type, instance, name, ctx }) {
  if (!type || !instance || !name) {
    throw new Error('Cannot unregister dates: type, instance and name are required');
  }
  const { deletedCount } = await ctx.tx.db.Dates.deleteMany({ type, instance, name });

  return deletedCount;
}

module.exports = { unregisterDates };
