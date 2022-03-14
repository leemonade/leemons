const initUsers = require('./src/users');
const initCenters = require('./src/centers');
const initProfiles = require('./src/profiles');
const initFamilies = require('./src/families');
const initAcademicPortfolio = require('./src/academicPortfolio');
const addCalendarAndEventAsClassroom = require('./src/calendar');
const addAWSS3AsProvider = require('./src/leebrary');
const addAWSEmailAsProvider = require('./src/emails');

async function events(isInstalled) {
  const config = {
    profiles: null,
    centers: null,
    users: null,
    programs: null,
  };

  if (!isInstalled) {
    // ·······························································
    // LOCALES

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

    // ·······························································
    // CENTERS, PROFILES & USERS

    leemons.events.once(
      [
        'plugins.users:init-permissions',
        'plugins.dataset:init-permissions',
        'plugins.calendar:init-permissions',
        'plugins.calendar:init-event-types',
        'plugins.academic-portfolio:init-permissions',
        'plugins.leebrary:init-permissions',
      ],
      async () => {
        try {
          config.centers = await initCenters();
          leemons.events.emit('init-centers', config.centers);

          config.profiles = await initProfiles();
          leemons.events.emit('init-profiles', config.profiles);

          config.users = await initUsers(config.centers, config.profiles);
          leemons.events.emit('init-users', config.users);

          await addCalendarAndEventAsClassroom(config.users);
        } catch (e) {
          console.error(e);
        }
      }
    );

    // ·······························································
    // FAMILIES

    leemons.events.once(
      [
        'plugins.families:pluginDidLoadServices',
        'plugins.mvp-template:init-profiles',
        'plugins.mvp-template:init-users',
      ],
      async () => {
        await initFamilies(config.profiles, config.users);
      }
    );

    // ·······························································
    // MEDIA LIBRARY

    leemons.events.once(
      [
        'plugins.leebrary:pluginDidLoadServices',
        'providers.leebrary-aws-s3:providerDidLoadServices',
      ],
      async () => {
        await addAWSS3AsProvider();
      }
    );

    // ·······························································
    // EMAILS

    leemons.events.once(
      [
        'plugins.emails:pluginDidLoadServices',
        'providers.emails-amazon-ses:providerDidLoadServices',
      ],
      async () => {
        await addAWSEmailAsProvider();
      }
    );

    // ·······························································
    // ACADEMIC PORTFOLIO

    leemons.events.once(
      [
        'plugins.academic-portfolio:pluginDidLoadServices',
        'plugins.mvp-template:init-profiles',
        'plugins.mvp-template:init-centers',
        'plugins.mvp-template:init-users',
      ],
      async () => {
        try {
          config.programs = await initAcademicPortfolio(config);
          leemons.events.emit('init-academic-portfolio', config.programs);
        } catch (e) {
          console.error(e);
        }
      }
    );
  }
}

module.exports = events;
