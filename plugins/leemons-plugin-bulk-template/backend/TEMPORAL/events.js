const path = require('path');
const fs = require('fs');
const initPlatform = require('./src/platform');
const initUsers = require('./src/users');
const initCenters = require('./src/centers');
const initLocales = require('./src/locales');
const initProfiles = require('./src/profiles');
const initFamilies = require('./src/families');
const initGrades = require('./src/grades');
const initAcademicPortfolio = require('./src/academicPortfolio');
const { initLibrary, updateLibrary } = require('./src/leebrary');
const initWidgets = require('./src/widgets');
const initTasks = require('./src/tasks');
const initTests = require('./src/tests');
const initCalendar = require('./src/calendar');
const initProviders = require('./src/providers');
const initAdmin = require('./src/admin');

async function events(isInstalled) {
  const { chalk } = global.utils;

  const docPath = path.resolve(__dirname, 'data.xlsx');

  const config = {
    profiles: null,
    centers: null,
    users: null,
    programs: null,
  };

  if (!isInstalled && fs.existsSync(docPath)) {
    // ·······························································
    // LOCALES

    leemons.events.once(
      [
        'users:pluginDidLoadServices',
        'admin:pluginDidLoadServices',
        'multilanguage:pluginDidLoadServices',
      ],
      async () => {
        leemons.log.debug(chalk`{cyan.bold BULK} {gray Init Platform & locales ...}`);
        await initLocales(docPath);
        leemons.events.emit('init-locales');

        await initPlatform(docPath);
        leemons.events.emit('init-platform');
        leemons.log.info(chalk`{cyan.bold BULK} Platform initialized`);
      }
    );

    // ·······························································
    // PROVIDERS

    leemons.events.once(
      [
        'emails:pluginDidLoadServices',
        'leebrary:pluginDidLoadServices',
        'providers.emails-aws-ses:providerDidLoadServices',
        'providers.leebrary-aws-s3:providerDidLoadServices',
      ],
      async () => {
        leemons.log.debug(chalk`{cyan.bold BULK} {gray Init Providers ...}`);
        await initProviders(docPath);
        leemons.events.emit('init-providers');
        leemons.log.info(chalk`{cyan.bold BULK} Providers initialized`);
      }
    );

    // ·······························································
    // CENTERS, PROFILES & USERS

    leemons.events.once(
      [
        'users:init-permissions',
        'dataset:init-permissions',
        'calendar:init-permissions',
        'calendar:init-event-types',
        'academic-portfolio:init-permissions',
        'leebrary:init-permissions',
        'grades:init-permissions',
        'tasks:init-permissions',
        'tests:init-permissions',
        'assignables:init-permissions',
        'scores:init-permissions',
        'academic-calendar:init-permissions',
        'content-creator:init-permissions',
        'comunica:init-permissions',
        'leebrary:pluginDidLoadServices',
        'admin:pluginDidLoadServices',
        'bulk-template:init-providers',
      ],
      async () => {
        try {
          leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Admin plugin ...}`);
          await initAdmin(docPath);
          leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Admin plugin`);

          leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Users plugin ...}`);
          config.centers = await initCenters(docPath);
          leemons.events.emit('init-centers', config.centers);

          config.profiles = await initProfiles(docPath);
          leemons.events.emit('init-profiles', config.profiles);

          config.users = await initUsers(docPath, config.centers, config.profiles);
          leemons.events.emit('init-users', config.users);
          leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Users plugin`);

          leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Academic Rules plugin ...}`);
          config.grades = await initGrades(docPath, config.centers);
          leemons.events.emit('init-grades', config.grades);
          leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Academic Rules plugin`);
        } catch (e) {
          // console.error(e);
        }
      }
    );

    // ·······························································
    // FAMILIES

    leemons.events.once(
      ['families:pluginDidLoadServices', 'bulk-template:init-profiles', 'bulk-template:init-users'],
      async () => {
        // await initFamilies(docPath, config.profiles, config.users);
      }
    );

    // ·······························································
    // MEDIA LIBRARY

    leemons.events.once(
      [
        'leebrary:pluginDidLoadServices',
        'providers.leebrary-aws-s3:providerDidLoadServices',
        'bulk-template:init-profiles',
        'bulk-template:init-users',
      ],
      async () => {
        leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Leebrary plugin ...}`);
        config.assets = await initLibrary(docPath, config);
        leemons.events.emit('init-leebrary', config.assets);
        leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Leebrary plugin`);
      }
    );

    leemons.events.once(
      ['bulk-template:init-academic-portfolio', 'bulk-template:init-leebrary'],
      async () => {
        leemons.log.debug(chalk`{cyan.bold BULK} {gray Updating Leebrary plugin with AP conf ...}`);
        await updateLibrary(docPath, config);
        leemons.log.info(chalk`{cyan.bold BULK} UPDATED Leebrary plugin`);
      }
    );

    // ·······························································
    // ACADEMIC PORTFOLIO

    leemons.events.once(
      [
        'academic-portfolio:pluginDidLoadServices',
        'bulk-template:init-profiles',
        'bulk-template:init-centers',
        'bulk-template:init-users',
        'bulk-template:init-grades',
        'bulk-template:init-leebrary',
      ],
      async () => {
        try {
          leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Academic Portfolio plugin ...}`);
          config.programs = await initAcademicPortfolio(docPath, config);
          leemons.events.emit('init-academic-portfolio', config.programs);
          leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Academic Portfolio plugin`);
        } catch (e) {
          // console.error(e);
        }
      }
    );

    // ·······························································
    // CALENDAR & KANBAN

    leemons.events.once(
      ['calendar:pluginDidLoadServices', 'bulk-template:init-academic-portfolio'],
      async () => {
        try {
          leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Calendar plugin ...}`);
          await initCalendar(docPath, config);
          leemons.events.emit('init-calendar');
          leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Calendar plugin`);
        } catch (e) {
          // console.error(e);
        }
      }
    );

    // ·······························································
    // TESTS & QBANKS

    leemons.events.once(
      [
        'tests:pluginDidLoadServices',
        'assignables:init-plugin',
        'bulk-template:init-academic-portfolio',
        'bulk-template:init-leebrary',
      ],
      async () => {
        try {
          leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Tests plugin ...}`);
          config.tests = await initTests(docPath, config);
          leemons.events.emit('init-tests', config.tests);
          leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Tests plugin`);
        } catch (e) {
          // console.error(e);
        }
      }
    );

    // ·······························································
    // TASKS

    leemons.events.once(
      [
        'tasks:pluginDidLoadServices',
        'assignables:init-plugin',
        'bulk-template:init-academic-portfolio',
        'bulk-template:init-leebrary',
        'bulk-template:init-tests',
      ],
      async () => {
        try {
          leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Tasks plugin ...}`);
          config.tasks = await initTasks(docPath, config);
          leemons.events.emit('init-tasks', config.tasks);
          leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Tasks plugin`);
        } catch (e) {
          // console.error(e);
        }
      }
    );

    // ·······························································
    // WIDGETS

    leemons.events.once(
      [
        'dashboard:init-widget-zones',
        'academic-portfolio:init-widget-items',
        'calendar:init-widget-items',
        'bulk-template:init-academic-portfolio',
      ],
      async () => {
        try {
          await initWidgets();
          leemons.events.emit('init-widgets');
          leemons.log.info(chalk`{cyan.bold BULK} INITIALIZED Widgets plugin`);
        } catch (e) {
          // console.error(e);
        }
      }
    );

    // ·······························································
    // FINALLY

    leemons.events.once(
      [
        'bulk-template:init-locales',
        'bulk-template:init-platform',
        'bulk-template:init-providers',
        'bulk-template:init-centers',
        'bulk-template:init-profiles',
        'bulk-template:init-users',
        'bulk-template:init-grades',
        'bulk-template:init-academic-portfolio',
        'bulk-template:init-leebrary',
        'bulk-template:init-tests',
        'bulk-template:init-tasks',
        'bulk-template:init-calendar',
        'bulk-template:init-widgets',
      ],
      () => {
        leemons.log.info(chalk`{cyan.bold BULK DONE} Template loaded`);
        if (process.env.PORT) {
          leemons.log.info(
            `Listening on http://${process.env.host || process.env.HOST || 'localhost'}:${
              process.env.PORT
            }`
          );
        }
      }
    );
  } else {
    leemons.log.info(
      chalk`{cyan.bold BULK} Bulk Template already installed or not file to import found`
    );
  }
}

module.exports = events;
