const { table } = require('../tables');

/**
 * Check if exist action
 * @public
 * @static
 * @param {string} actionName - Action name
 * @return {Promise<boolean>} Created actions
 * */
async function exist(actionName) {
  const result = await table.actions.count({ actionName });
  return !!result;
}

module.exports = { exist };
