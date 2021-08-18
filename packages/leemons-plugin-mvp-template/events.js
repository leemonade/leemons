const initRoles = require('./src/roles');
const initUsers = require('./src/users');
const initCenters = require('./src/centers');
const initProfiles = require('./src/profiles');
const _ = require('lodash');
const { ca } = require('wait-on/exampleConfig');

async function events(isInstalled) {
  console.log('MVP events');

  if (!isInstalled) {
    const services = {
      users: false,
      multilanguage: false,
    };
    const configLocales = async () => {
      try {
        await leemons.getPlugin('users').services.platform.addLocale('es', 'Español');
        await leemons.getPlugin('users').services.platform.addLocale('en', 'English');
        await leemons.getPlugin('users').services.platform.addLocale('es-ES', 'Español (España)');
        await leemons.getPlugin('users').services.platform.setDefaultLocale('en');
      } catch (e) {
        console.error(e);
      }
    };

    const config = async () => {
      try {
        const centers = await initCenters();
        const profiles = await initProfiles();
        const users = await initUsers(centers, profiles);
      } catch (e) {
        console.error(e);
      }
    };

    leemons.events.once('plugins.users:pluginDidLoadServices', async () => {
      if (services.multilanguage) configLocales();
      services.users = true;
    });

    leemons.events.once('plugins.multilanguage:pluginDidLoadServices', async () => {
      if (services.users) configLocales();
      services.multilanguage = true;
    });

    leemons.events.once('plugins.users:init-permissions', async () => {
      config();
    });
  }
}

module.exports = events;
