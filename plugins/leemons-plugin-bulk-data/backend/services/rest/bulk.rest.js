const fs = require('fs');
const chalk = require('chalk');
const { LeemonsError } = require('@leemons/error');

const { createTempFile } = require('../../core/helpers/createTempFile');
const initPlatform = require('../../core/platform');
const initUsers = require('../../core/users');
const initCenters = require('../../core/centers');
const initLocales = require('../../core/locales');
const initProfiles = require('../../core/profiles');
const initGrades = require('../../core/grades');
const initAcademicPortfolio = require('../../core/academicPortfolio');
const { initLibrary, updateLibrary } = require('../../core/leebrary');
const initWidgets = require('../../core/widgets');
const initTasks = require('../../core/tasks');
const initTests = require('../../core/tests');
const initCalendar = require('../../core/calendar');
const initProviders = require('../../core/providers');
const initAdmin = require('../../core/admin');

const LOAD_PHASES = {
  LOCALES: 'locales',
  PLATFORM: 'platform',
  PROVIDERS: 'providers',
  ADMIN: 'admin',
  CENTERS: 'centers',
  PROFILES: 'profiles',
  USERS: 'users',
  GRADES: 'grades',
  LIBRARY: 'library',
  AP: 'academic portfolio',
  CALENDAR: 'calendar',
  TESTS: 'tests',
  TASKS: 'tasks',
  WIDGETS: 'widgets',
};

const PHASES = Object.keys(LOAD_PHASES).map((key) => LOAD_PHASES[key]);

let currentPhase = null;

function getLoadProgress() {
  if (!currentPhase) {
    return 0;
  }

  const total = Object.keys(LOAD_PHASES).length;
  const current = PHASES.indexOf(currentPhase) + 1;

  return Math.floor((current / total) * 100);
}

function getLoadStatus(ctx) {
  const progress = getLoadProgress();

  ctx.status = 200;
  ctx.body = {
    status: 200,
    currentPhase: String(currentPhase).toUpperCase(),
    overallProgress: `${progress} %`,
  };
}

async function bulkData({ docPath, ctx }) {
  const config = {
    profiles: null,
    centers: null,
    users: null,
    programs: null,
  };

  if (fs.existsSync(docPath)) {
    // ·······························································
    // LOCALES

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Init Platform & locales ...}`);
    await initLocales({ file: docPath, ctx });
    currentPhase = LOAD_PHASES.LOCALES;

    await initPlatform({ file: docPath, ctx });
    ctx.logger.info(chalk`{cyan.bold BULK} Platform initialized`);
    currentPhase = LOAD_PHASES.PLATFORM;

    // ·······························································
    // PROVIDERS

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Init Providers ...}`);
    await initProviders({ file: docPath, ctx });
    ctx.logger.info(chalk`{cyan.bold BULK} Providers initialized`);
    currentPhase = LOAD_PHASES.PROVIDERS;

    // ·······························································
    // ! CENTERS, PROFILES & USERS

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Admin plugin ...}`);
    await initAdmin({ file: docPath, ctx });
    ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Admin plugin`);
    currentPhase = LOAD_PHASES.ADMIN;

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Users plugin ...}`);
    config.centers = await initCenters({ file: docPath, ctx });
    currentPhase = LOAD_PHASES.CENTERS;

    config.profiles = await initProfiles({ file: docPath, ctx });
    currentPhase = LOAD_PHASES.PROFILES;

    config.users = await initUsers({
      file: docPath,
      centers: config.centers,
      profiles: config.profiles,
      ctx,
    });
    ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Users plugin`);
    currentPhase = LOAD_PHASES.USERS;

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Academic Rules plugin ...}`);
    config.grades = await initGrades({ file: docPath, centers: config.centers, ctx });
    ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Academic Rules plugin`);
    currentPhase = LOAD_PHASES.GRADES;

    // ·······························································
    // ! MEDIA LIBRARY

    // ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Leebrary plugin ...}`);
    // config.assets = await initLibrary(docPath, config);
    // ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Leebrary plugin`);
    // currentPhase = LOAD_PHASES.LIBRARY;

    // ·······························································
    // ! ACADEMIC PORTFOLIO

    // ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Academic Portfolio plugin ...}`);
    // config.programs = await initAcademicPortfolio(docPath, config);
    // ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Academic Portfolio plugin`);
    // currentPhase = LOAD_PHASES.AP;

    // ctx.logger.debug(chalk`{cyan.bold BULK} {gray Updating Leebrary plugin with AP conf ...}`);
    // await updateLibrary(docPath, config);
    // ctx.logger.info(chalk`{cyan.bold BULK} UPDATED Leebrary plugin`);

    // ·······························································
    // ! CALENDAR & KANBAN

    // ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Calendar plugin ...}`);
    // await initCalendar(docPath, config);
    // ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Calendar plugin`);
    // currentPhase = LOAD_PHASES.CALENDAR;

    // ·······························································
    // ! TESTS & QBANKS

    // ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Tests plugin ...}`);
    // config.tests = await initTests(docPath, config);
    // ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Tests plugin`);
    // currentPhase = LOAD_PHASES.TESTS;

    // ·······························································
    // ! TASKS

    // ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Tasks plugin ...}`);
    // config.tasks = await initTasks(docPath, config);
    // ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Tasks plugin`);
    // currentPhase = LOAD_PHASES.TASKS;

    // ·······························································
    // ! WIDGETS

    // await initWidgets();
    // currentPhase = LOAD_PHASES.WIDGETS;
  }
}

module.exports = {
  loadRest: {
    rest: {
      path: '/load-from-file',
      method: 'POST',
    },
    async handler(ctx) {
      console.log('🛑 en bulk-data: ctx.meta => ', ctx.meta);
      const settings = await ctx.tx.call('admin.settings.findOne');
      console.log('🛑 aquí bulk-data, settings =>', settings);

      if (settings?.status !== 'INSTALLED' && !settings?.configured) {
        const file = await createTempFile({ readStream: ctx.params });
        console.log('file.path', file.path);
        await bulkData({ docPath: file.path, ctx });
        return { status: 200, currentPhase: 'Proccessing file', overallProgress: '0%' };
      }
      // await adminServices.settings.update({ status: 'INSTALLED', configured: true });
      throw new LeemonsError(ctx, { message: 'Something went wrong', httpStatusCode: 403 });
    },
  },
  statusRest: getLoadStatus,
};
