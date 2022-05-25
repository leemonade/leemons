const initUsers = require('./src/users');
const initCenters = require('./src/centers');
const initProfiles = require('./src/profiles');
const initFamilies = require('./src/families');
const initGrades = require('./src/grades');
const initAcademicPortfolio = require('./src/academicPortfolio');
const { addAWSS3AsProvider, initLibrary } = require('./src/leebrary');
const addAWSEmailAsProvider = require('./src/emails');
const initWidgets = require('./src/widgets');
const initTasks = require('./src/tasks');
// const addCalendarAndEventAsClassroom = require('./src/calendar');
// const initTests = require('./src/tests');

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
        'plugins.grades:init-permissions',
        'plugins.tasks:init-permissions',
        'plugins.tests:init-permissions',
        'plugins.assignables:init-permissions',
      ],
      async () => {
        try {
          config.centers = await initCenters();
          leemons.events.emit('init-centers', config.centers);

          config.profiles = await initProfiles();
          leemons.events.emit('init-profiles', config.profiles);

          config.users = await initUsers(config.centers, config.profiles);
          leemons.events.emit('init-users', config.users);

          config.grades = await initGrades(config.centers);
          leemons.events.emit('init-grades', config.grades);

          // await addCalendarAndEventAsClassroom(config.users);
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
        'plugins.mvp-template:init-profiles',
        'plugins.mvp-template:init-users',
      ],
      async () => {
        console.log('MVP - Iniciando el plugin de Leebrary');
        await addAWSS3AsProvider();
        config.assets = await initLibrary(config);
        leemons.events.emit('init-leebrary', config.assets);
        console.log('MVP - Plugin de Leebrary inicializado!');
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
        'plugins.mvp-template:init-grades',
        'plugins.mvp-template:init-leebrary',
      ],
      async () => {
        try {
          console.log('MVP - Iniciando el plugin de Academic Portfolio');
          config.programs = await initAcademicPortfolio(config);
          leemons.events.emit('init-academic-portfolio', config.programs);
          console.log('MVP - Plugin de Academic Portfolio inicializado!');
        } catch (e) {
          console.error(e);
        }
      }
    );

    // ·······························································
    // TESTS & QBANKS

    leemons.events.once(
      [
        'plugins.tests:pluginDidLoadServices',
        'plugins.assignables:init-plugin',
        'plugins.mvp-template:init-academic-portfolio',
        'plugins.mvp-template:init-leebrary',
      ],
      async () => {
        try {
          console.log('MVP - Iniciando el plugin de Tests');
          // config.tests = await initTests(config);
          // leemons.events.emit('init-tests', config.tests);
        } catch (e) {
          console.error(e);
        }
      }
    );

    // ·······························································
    // TASKS

    leemons.events.once(
      [
        'plugins.tasks:pluginDidLoadServices',
        'plugins.assignables:init-plugin',
        'plugins.mvp-template:init-academic-portfolio',
        'plugins.mvp-template:init-leebrary',
      ],
      async () => {
        try {
          console.log('MVP - Iniciando el plugin de Tasks');
          config.tasks = await initTasks(config);
          console.log('MVP - Plugin de Tasks inicializado!');
        } catch (e) {
          console.error(e);
        }
      }
    );

    // ·······························································
    // WIDGETS

    leemons.events.once(
      [
        'plugins.dashboard:init-widget-zones',
        'plugins.academic-portfolio:init-widget-items',
        'plugins.calendar:init-widget-items',
        'plugins.mvp-template:init-academic-portfolio',
      ],
      async () => {
        try {
          await initWidgets();
          leemons.events.emit('init-widgets');
        } catch (e) {
          console.error(e);
        }
      }
    );
  }
}

module.exports = events;
