const loadLocalizations = require('./src/services/loadLocalizations');

const pluginName = 'plugins.multilanguage';

function initLocalizations() {
  leemons.events.once(`${pluginName}:pluginDidLoad`, loadLocalizations);

  leemons.events.on(`${pluginName}:newLocale`, loadLocalizations);
}

module.exports = async function events() {
  initLocalizations();
};
