const _ = require('lodash');
const findOne = require('./findOne');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function update({ ctx, ...theme }) {
  let currentTheme = await findOne({ ctx });
  if (_.isNil(currentTheme)) {
    currentTheme = await ctx.tx.db.Theme.create({ configured: false });
    currentTheme = currentTheme.toObject();
  }
  const newTheme = { ...currentTheme, ...theme };
  delete newTheme.id;

  return ctx.tx.db.Theme.findOneAndUpdate({ id: currentTheme.id }, newTheme, {
    new: true,
    lean: true,
  });
}

module.exports = update;
