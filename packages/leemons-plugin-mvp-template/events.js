const initRoles = require('./src/roles');
const initUsers = require('./src/users');
const initCenters = require('./src/centers');
const initProfiles = require('./src/profiles');
const _ = require('lodash');

async function events() {
  console.log('Init multiple');
  leemons.events.once('plugins.users:pluginDidLoadServices', async () => {
    try {
      console.log('Añadimos mvp');
      await leemons.getPlugin('users').services.platform.setLocale('en');
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
  });
}

module.exports = events;
