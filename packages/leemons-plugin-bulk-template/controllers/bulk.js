const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const initPlatform = require('../src/platform');
const initUsers = require('../src/users');
const initCenters = require('../src/centers');
const initLocales = require('../src/locales');
const initProfiles = require('../src/profiles');
const initGrades = require('../src/grades');
const initAcademicPortfolio = require('../src/academicPortfolio');
const { initLibrary, updateLibrary } = require('../src/leebrary');
const initWidgets = require('../src/widgets');
const initTasks = require('../src/tasks');
const initTests = require('../src/tests');
const initCalendar = require('../src/calendar');
const initProviders = require('../src/providers');
const initAdmin = require('../src/admin');

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

async function bulkData(docPath) {
  const { chalk } = global.utils;

  const config = {
    profiles: null,
    centers: null,
    users: null,
    programs: null,
  };

  if (fs.existsSync(docPath)) {
    // ·······························································
    // LOCALES

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Init Platform & locales ...}`);
    await initLocales(docPath);
    currentPhase = LOAD_PHASES.LOCALES;

    await initPlatform(docPath);
    leemons.log.info(chalk`{cyan.bold BULK} Platform initialized`);
    currentPhase = LOAD_PHASES.PLATFORM;

    // ·······························································
    // PROVIDERS

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Init Providers ...}`);
    await initProviders(docPath);
    leemons.log.info(chalk`{cyan.bold BULK} Providers initialized`);
    currentPhase = LOAD_PHASES.PROVIDERS;

    // ·······························································
    // CENTERS, PROFILES & USERS

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Admin plugin ...}`);
    await initAdmin(docPath);
    leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Admin plugin`);
    currentPhase = LOAD_PHASES.ADMIN;

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Users plugin ...}`);
    config.centers = await initCenters(docPath);
    currentPhase = LOAD_PHASES.CENTERS;

    config.profiles = await initProfiles(docPath);
    currentPhase = LOAD_PHASES.PROFILES;

    config.users = await initUsers(docPath, config.centers, config.profiles);
    leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Users plugin`);
    currentPhase = LOAD_PHASES.USERS;

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Academic Rules plugin ...}`);
    config.grades = await initGrades(docPath, config.centers);
    leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Academic Rules plugin`);
    currentPhase = LOAD_PHASES.GRADES;

    // ·······························································
    // MEDIA LIBRARY

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Leebrary plugin ...}`);
    config.assets = await initLibrary(docPath, config);
    leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Leebrary plugin`);
    currentPhase = LOAD_PHASES.LIBRARY;

    // ·······························································
    // ACADEMIC PORTFOLIO

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Academic Portfolio plugin ...}`);
    config.programs = await initAcademicPortfolio(docPath, config);
    leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Academic Portfolio plugin`);
    currentPhase = LOAD_PHASES.AP;

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Updating Leebrary plugin with AP conf ...}`);
    await updateLibrary(docPath, config);
    leemons.log.info(chalk`{cyan.bold BULK} UPDATED Leebrary plugin`);

    // ·······························································
    // CALENDAR & KANBAN

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Calendar plugin ...}`);
    await initCalendar(docPath, config);
    leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Calendar plugin`);
    currentPhase = LOAD_PHASES.CALENDAR;

    // ·······························································
    // TESTS & QBANKS

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Tests plugin ...}`);
    config.tests = await initTests(docPath, config);
    leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Tests plugin`);
    currentPhase = LOAD_PHASES.TESTS;

    // ·······························································
    // TASKS

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Tasks plugin ...}`);
    config.tasks = await initTasks(docPath, config);
    leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Tasks plugin`);
    currentPhase = LOAD_PHASES.TASKS;

    // ·······························································
    // WIDGETS

    await initWidgets();
    currentPhase = LOAD_PHASES.WIDGETS;
  }
}

async function loadData(ctx) {
  const { services: adminServices } = leemons.getPlugin('admin');
  const settings = await adminServices.settings.findOne();

  if (settings?.status !== 'INSTALLED' && !settings?.configured) {
    const { files } = ctx.request;

    if (!files.doc) {
      ctx.status = 400;
      ctx.body = { status: 400, message: 'Doc file is required' };
    }

    bulkData(files.doc.path);

    ctx.status = 200;
    ctx.body = { status: 200, currentPhase: 'Proccessing file', overallProgress: '0%' };
  } else {
    // await adminServices.settings.update({ status: 'INSTALLED', configured: true });
    ctx.status = 403;
    ctx.body = { status: 403 };
  }
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

module.exports = { load: loadData, status: getLoadStatus };
