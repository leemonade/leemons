const _ = require('lodash');
const constants = require('./config/constants');
const { addLocales } = require('./src/services/locales/addLocales');

async function events(isInstalled) {
  leemons.events.once('multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });

  if (!isInstalled) {
    // Permissions
    leemons.events.once('users:init-permissions', async () => {
      await leemons.getPlugin('users').services.permissions.addMany(constants.permissions);
      leemons.events.emit('init-permissions');
    });

    // Dataset
    leemons.events.once(
      ['dataset:pluginDidLoadServices', 'multilanguage:pluginDidLoad'],
      async () => {
        await Promise.all(
          _.map(constants.datasetLocations, (config) =>
            leemons.getPlugin('dataset').services.dataset.addLocation(config)
          )
        );
        leemons.events.emit('init-dataset-locations');
      }
    );
  } else {
    leemons.events.once('families-emergency-numbers:pluginDidInit', async () => {
      leemons.events.emit('init-permissions');
      leemons.events.emit('init-dataset-locations');
    });
  }
}

module.exports = events;
