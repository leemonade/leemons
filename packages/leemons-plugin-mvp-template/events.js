const initUsers = require('./src/users');
const initCenters = require('./src/centers');
const initLocales = require('./src/locales');
const initProfiles = require('./src/profiles');
const initFamilies = require('./src/families');
const initGrades = require('./src/grades');
const initAcademicPortfolio = require('./src/academicPortfolio');
const { addAWSS3AsProvider, initLibrary } = require('./src/leebrary');
const addAWSEmailAsProvider = require('./src/emails');
const initWidgets = require('./src/widgets');
const initTasks = require('./src/tasks');
const initTests = require('./src/tests');
const initCalendar = require('./src/calendar');

async function initAdmin() {
  const { services } = leemons.getPlugin('admin');
  await services.settings.update({ status: 'INSTALLED', configured: true });
}

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

    leemons.events.once(
      [
        'plugins.users:pluginDidLoadServices',
        'plugins.admin:pluginDidLoadServices',
        'plugins.multilanguage:pluginDidLoadServices',
      ],
      async () => {
        await initLocales();
        leemons.events.emit('init-locales');
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
        'plugins.leebrary:pluginDidLoadServices',
        'plugins.admin:pluginDidLoadServices',
        'providers.leebrary-aws-s3:providerDidLoadServices',
      ],
      async () => {
        try {
          await addAWSS3AsProvider();

          leemons.log.debug('MVP - Starting Users plugin ...');
          config.centers = await initCenters();
          leemons.events.emit('init-centers', config.centers);

          config.profiles = await initProfiles();
          leemons.events.emit('init-profiles', config.profiles);

          config.users = await initUsers(config.centers, config.profiles);
          leemons.events.emit('init-users', config.users);
          leemons.log.info('MVP - STARTED Users plugin');

          leemons.log.debug('MVP - Starting Academic Rules plugin ...');
          config.grades = await initGrades(config.centers);
          leemons.events.emit('init-grades', config.grades);
          leemons.log.info('MVP - STARTED Academic Rules plugin');

          await initAdmin();
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
        leemons.log.debug('MVP - Starting Leebrary plugin ...');
        config.assets = await initLibrary(config);
        leemons.events.emit('init-leebrary', config.assets);
        leemons.log.info('MVP - STARTED Leebrary plugin');
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
          leemons.log.debug('MVP - Starting Academic Portfolio plugin ...');
          config.programs = await initAcademicPortfolio(config);
          leemons.events.emit('init-academic-portfolio', config.programs);
          leemons.log.info('MVP - STARTED Academic Portfolio plugin');
        } catch (e) {
          console.error(e);
        }
      }
    );

    // ·······························································
    // CALENDAR & KANBAN

    leemons.events.once(
      ['plugins.calendar:pluginDidLoadServices', 'plugins.mvp-template:init-academic-portfolio'],
      async () => {
        try {
          leemons.log.debug('MVP - Starting Calendar plugin ...');
          await initCalendar(config);
          leemons.log.info('MVP - STARTED Calendar plugin');
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
          leemons.log.debug('MVP - Starting Tests plugin ...');
          config.tests = await initTests(config);
          leemons.events.emit('init-tests', config.tests);
          leemons.log.info('MVP - STARTED Tests plugin');
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
          // leemons.log.debug('MVP - Starting Tasks plugin ...');
          // config.tasks = await initTasks(config);
          // leemons.log.info('MVP - STARTED Tasks plugin');
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
