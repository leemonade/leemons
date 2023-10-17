const { LeemonsError } = require('@leemons/error');

async function registerDate({ type, instance, name, date, ctx }) {
  if (!type || !instance || !name || !date) {
    throw new LeemonsError(ctx, {
      message:
        'Cannot register date: type, instance, name and date are required',
      httpStatusCode: 400,
    });
  }
  await ctx.tx.db.Dates.create({ type, instance, name, date });

  return {
    type,
    instance,
    name,
    date,
  };
}

module.exports = { registerDate };
