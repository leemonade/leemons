const initUsers = require('./src/users');
const initCenters = require('./src/centers');
const initProfiles = require('./src/profiles');
const _ = require('lodash');
const { setFamilyProfiles } = require('./src/familyProfiles');
const addCalendarAndEventAsClassroom = require('./src/calendar');

async function events(isInstalled) {
  const config = {
    profiles: null,
    centers: null,
    users: null,
  };

  if (!isInstalled) {
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

    leemons.events.once(
      ['plugins.users:pluginDidLoadServices', 'plugins.multilanguage:pluginDidLoadServices'],
      async () => {
        await configLocales();
      }
    );

    leemons.events.once(
      ['plugins.families:pluginDidLoadServices', 'plugins.mvp-template:init-profiles'],
      async () => {
        await setFamilyProfiles(config.profiles);
      }
    );

    leemons.events.once('plugins.users:init-permissions', async () => {
      try {
        config.centers = await initCenters();
        leemons.events.emit('init-centers', config.centers);
        config.profiles = await initProfiles();
        leemons.events.emit('init-profiles', config.profiles);
        config.users = await initUsers(config.centers, config.profiles);
        await addCalendarAndEventAsClassroom(config.users);
      } catch (e) {
        console.error(e);
      }
    });
  }
}

module.exports = events;
