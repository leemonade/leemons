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
    const config = async () => {
      try {
        await leemons.getPlugin('users').services.platform.addLocale('en', 'English');
        await leemons.getPlugin('users').services.platform.addLocale('es', 'Español');
        await leemons.getPlugin('users').services.platform.addLocale('es-ES', 'Español (España)');
        await leemons.getPlugin('users').services.platform.setDefaultLocale('en');
        const centers = await initCenters();
        console.log('centers', centers);
        const roles = await initRoles(centers);
        console.log('roles', roles);
        const users = await initUsers(roles);
        console.log('users', users);
        const profiles = await initProfiles(roles);
        console.log('profiles', profiles);
      } catch (e) {
        console.error(e);
      }
    };

    leemons.events.once('plugins.users:pluginDidLoadServices', async () => {
      if (services.multilanguage) config();
      services.users = true;
    });

    leemons.events.once('plugins.multilanguage:pluginDidLoadServices', async () => {
      if (services.users) config();
      services.multilanguage = true;
    });
  }
}

module.exports = events;
