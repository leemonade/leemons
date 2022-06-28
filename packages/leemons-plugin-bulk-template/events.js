const initPlatform = require('./src/platform');
const initUsers = require('./src/users');
const initCenters = require('./src/centers');
const initLocales = require('./src/locales');
const initProfiles = require('./src/profiles');
const initFamilies = require('./src/families');
const initGrades = require('./src/grades');
const initAcademicPortfolio = require('./src/academicPortfolio');
const { initLibrary } = require('./src/leebrary');
const initWidgets = require('./src/widgets');
const initTasks = require('./src/tasks');
const initTests = require('./src/tests');
const initCalendar = require('./src/calendar');
const initProviders = require('./src/providers');

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
        leemons.log.debug('BULK - Init Platform & locales ...');
        await initLocales();
        leemons.events.emit('init-locales');

        await initPlatform();
        leemons.events.emit('init-platform');
        leemons.log.info('BULK - Platform initialized');
      }
    );

    // ·······························································
    // PROVIDERS

    leemons.events.once(
      [
        'plugins.emails:pluginDidLoadServices',
        'plugins.leebrary:pluginDidLoadServices',
        'providers.emails-amazon-ses:providerDidLoadServices',
        'providers.leebrary-aws-s3:providerDidLoadServices',
      ],
      async () => {
        leemons.log.debug('BULK - Init Providers ...');
        await initProviders();
        leemons.events.emit('init-providers');
        leemons.log.info('BULK - Providers initialized');
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
        'plugins.bulk-template:init-providers',
      ],
      async () => {
        try {
          leemons.log.debug('BULK - Starting Users plugin ...');
          config.centers = await initCenters();
          leemons.events.emit('init-centers', config.centers);

          config.profiles = await initProfiles();
          leemons.events.emit('init-profiles', config.profiles);

          config.users = await initUsers(config.centers, config.profiles);
          leemons.events.emit('init-users', config.users);
          leemons.log.info('BULK - COMPLETED Users plugin');

          leemons.log.debug('BULK - Starting Academic Rules plugin ...');
          config.grades = await initGrades(config.centers);
          leemons.events.emit('init-grades', config.grades);
          leemons.log.info('BULK - COMPLETED Academic Rules plugin');

          await initAdmin();
        } catch (e) {
          // console.error(e);
        }
      }
    );

    // ·······························································
    // FAMILIES

    leemons.events.once(
      [
        'plugins.families:pluginDidLoadServices',
        'plugins.bulk-template:init-profiles',
        'plugins.bulk-template:init-users',
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
        'plugins.bulk-template:init-profiles',
        'plugins.bulk-template:init-users',
      ],
      async () => {
        leemons.log.debug('BULK - Starting Leebrary plugin ...');
        config.assets = await initLibrary(config);
        leemons.events.emit('init-leebrary', config.assets);
        leemons.log.info('BULK - COMPLETED Leebrary plugin');
      }
    );

    // ·······························································
    // ACADEMIC PORTFOLIO

    leemons.events.once(
      [
        'plugins.academic-portfolio:pluginDidLoadServices',
        'plugins.bulk-template:init-profiles',
        'plugins.bulk-template:init-centers',
        'plugins.bulk-template:init-users',
        'plugins.bulk-template:init-grades',
        'plugins.bulk-template:init-leebrary',
      ],
      async () => {
        try {
          leemons.log.debug('BULK - Starting Academic Portfolio plugin ...');
          config.programs = await initAcademicPortfolio(config);
          leemons.events.emit('init-academic-portfolio', config.programs);
          leemons.log.info('BULK - COMPLETED Academic Portfolio plugin');
        } catch (e) {
          // console.error(e);
        }
      }
    );

    // ·······························································
    // CALENDAR & KANBAN

    leemons.events.once(
      ['plugins.calendar:pluginDidLoadServices', 'plugins.bulk-template:init-academic-portfolio'],
      async () => {
        try {
          leemons.log.debug('BULK - Starting Calendar plugin ...');
          await initCalendar(config);
          leemons.events.emit('init-calendar');
          leemons.log.info('BULK - COMPLETED Calendar plugin');
        } catch (e) {
          // console.error(e);
        }
      }
    );

    // ·······························································
    // TESTS & QBANKS

    leemons.events.once(
      [
        'plugins.tests:pluginDidLoadServices',
        'plugins.assignables:init-plugin',
        'plugins.bulk-template:init-academic-portfolio',
        'plugins.bulk-template:init-leebrary',
      ],
      async () => {
        try {
          leemons.log.debug('BULK - Starting Tests plugin ...');
          config.tests = await initTests(config);
          leemons.events.emit('init-tests', config.tests);
          leemons.log.info('BULK - COMPLETED Tests plugin');
        } catch (e) {
          // console.error(e);
        }
      }
    );

    // ·······························································
    // TASKS

    leemons.events.once(
      [
        'plugins.tasks:pluginDidLoadServices',
        'plugins.assignables:init-plugin',
        'plugins.bulk-template:init-academic-portfolio',
        'plugins.bulk-template:init-leebrary',
      ],
      async () => {
        try {
          leemons.log.debug('BULK - Starting Tasks plugin ...');
          config.tasks = await initTasks(config);
          leemons.events.emit('init-tasks', config.tasks);
          leemons.log.info('BULK - COMPLETED Tasks plugin');
        } catch (e) {
          // console.error(e);
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
        'plugins.bulk-template:init-academic-portfolio',
      ],
      async () => {
        try {
          await initWidgets();
          leemons.events.emit('init-widgets');
        } catch (e) {
          // console.error(e);
        }
      }
    );

    // ·······························································
    // FINALLY

    leemons.events.once(
      [
        'plugins.bulk-template:init-locales',
        'plugins.bulk-template:init-platform',
        'plugins.bulk-template:init-providers',
        'plugins.bulk-template:init-centers',
        'plugins.bulk-template:init-profiles',
        'plugins.bulk-template:init-users',
        'plugins.bulk-template:init-grades',
        'plugins.bulk-template:init-academic-portfolio',
        'plugins.bulk-template:init-leebrary',
        'plugins.bulk-template:init-tests',
        'plugins.bulk-template:init-tasks',
        'plugins.bulk-template:init-calendar',
        'plugins.bulk-template:init-widgets',
      ],
      () => {
        leemons.log.info('BULK - DONE Loading template ');
        leemons.log.info(`Listening on http://localhost:${process.env.port}`);
      }
    );
  }
}

module.exports = events;
