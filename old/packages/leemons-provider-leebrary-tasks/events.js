const { pluginName, category } = require('./config/constants');

async function events(isInstalled) {
  if (!isInstalled) {
    // ·······························································
    // REGISTER LIBRARY MENU ITEMS & CATEGORIES

    leemons.events.once(
      ['plugins.leebrary:init-categories', `plugins.tasks:init-permissions`],
      async () => {
        const { add: addCategory } = leemons.getPlugin('leebrary').services.categories;

        await addCategory(category);

        leemons.events.emit('init-leebrary');
      }
    );
  } else {
    leemons.events.once(`${pluginName}:pluginDidInit`, async () => {
      leemons.events.emit('init-leebrary');
    });
  }
}

module.exports = events;
