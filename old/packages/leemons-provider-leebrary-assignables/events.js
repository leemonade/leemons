const { pluginName } = require('./config/constants');

async function events() {
  leemons.events.once(
    [`plugins.assignables:'init-plugin`, `${pluginName}:pluginDidInit`],
    async () => {
      leemons.events.emit('init-leebrary');
    }
  );
}

module.exports = events;
