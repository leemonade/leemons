const init = require('./init');
const constants = require('./config/constants');
module.exports = async (isInstalled) => {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    init();
  });
  if (!isInstalled) {
    leemons.events.once('plugins.users:init-permissions', async () => {
      leemons.getPlugin('users').services.permissions.addMany(constants.defaultPermissions);
      leemons.events.emit('init-permissions');
    });
  } else {
    leemons.events.once('plugins.dataset:pluginDidInit', async () => {
      leemons.events.emit('init-permissions');
    });
  }
};
