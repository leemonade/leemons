const _ = require('lodash');
const { table } = require('../tables');
const findOne = require('./findOne');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function update(theme, { transacting } = {}) {
  let currentTheme = await findOne({ transacting });
  if (_.isNil(currentTheme)) {
    currentTheme = await table.theme.create({ configured: false });
  }
  const newTheme = { ...currentTheme, ...theme };
  delete newTheme.id;

  return table.theme.update({ id: currentTheme.id }, newTheme, { transacting });
}

module.exports = update;
