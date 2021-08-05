const init = require('./init');
module.exports = async (isInstalled) => {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    init();
  });
};
