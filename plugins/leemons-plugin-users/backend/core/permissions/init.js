const constants = require('../../../config/constants');

/**
 * Creates the default permissions that come with the leemons app
 * @public
 * @static
 * */
async function init() {
  await leemons.plugin.services.permissions.addMany(constants.defaultPermissions);
}

module.exports = { init };
