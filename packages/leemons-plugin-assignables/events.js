async function events() {
  leemons.events.once(
    ['plugins.assignables:pluginDidLoadServices', 'plugins.leebrary:init-menu'],
    async () => {
      leemons.events.emit('init-plugin');
    }
  );
}

module.exports = events;
