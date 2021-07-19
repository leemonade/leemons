const { table } = require('../tables');

/**
 * Check if exist action
 * @public
 * @static
 * @param {string} actionName - Action name
 * @param {any} transacting - DB Transaction
 * @return {Promise<boolean>} Created actions
 * */
async function exist(actionName, { transacting }) {
  const result = await table.actions.count({ actionName }, { transacting });
  return !!result;
}

module.exports = { exist };
