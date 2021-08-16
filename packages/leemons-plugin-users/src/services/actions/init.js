const constants = require('../../../config/constants');
const { addMany } = require('./addMany');

/**
 * Creates the default actions that come with the leemons app
 * @public
 * @static
 * */
async function init() {
  return await addMany(constants.defaultActions);
}

module.exports = { init };
