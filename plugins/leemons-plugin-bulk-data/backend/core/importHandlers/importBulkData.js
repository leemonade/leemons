const fs = require('fs');
const chalk = require('chalk');
const { setTimeout } = require('timers/promises');
const { isString } = require('lodash');
const initLocales = require('../locales');
const initPlatform = require('../platform');
const initProviders = require('../providers');
const initAdmin = require('../admin');
const initCenters = require('../centers');
const initProfiles = require('../profiles');
const initUsers = require('../users');
const initGrades = require('../grades');
const { initLibrary, updateLibrary } = require('../leebrary');
const initAcademicPortfolio = require('../academicPortfolio');
const initCalendar = require('../calendar');
const { initAcademicCalendar, initProgramCalendars } = require('../academicCalendar');
const initTests = require('../tests');
const initTasks = require('../tasks');
const initWidgets = require('../widgets');

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
  ACADEMIC_CALENDAR: 'academic calendar',
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

function getLoadStatus() {
  const progress = getLoadProgress();
  const workingPhaseIndex = PHASES.indexOf(currentPhase) + 1;

  return {
    status: 200,
    inProgressPhase: String(PHASES[workingPhaseIndex]).toUpperCase(),
    currentPhase: String(currentPhase).toUpperCase(),
    overallProgress: `${progress} %`,
  };
}

async function shareAssetsWithProfile({ profileId, assets, ctx }) {
  if (!profileId) {
    console.error('Could not share asset, no profile id found');
    return;
  }

  const promises = [];
  assets.forEach((asset) => {
    const permissionName = `users.profile.inside.${profileId}`;
    const assetId = isString(asset) ? asset : asset.id;

    promises.push(
      ctx.tx.call('leebrary.permissions.set', {
        canAccess: [],
        permissions: {
          viewer: [permissionName],
          editor: [],
          assigner: [],
        },
        assetId,
        isPublic: !!asset.public,
      })
    );
  });

  await Promise.all(promises);
}

async function importBulkData({
  docPath,
  preConfig = {},
  shareLibraryAssetsWithTeacherProfile,
  ctx,
}) {
  const skipAppInitialization = !!preConfig.centers && !!preConfig.profiles;
  const skipEnrollment = !!preConfig.users;

  const config = {
    profiles: preConfig.profiles ?? null,
    centers: preConfig.centers ?? null,
    users: preConfig.users ?? null,
    programs: null,
  };

  currentPhase = null;

  if (fs.existsSync(docPath)) {
    // ································································
    // APP INITIALIZATION

    if (!skipAppInitialization) {
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
      // CENTERS, PROFILES

      ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Admin plugin ...}`);
      await initAdmin({ file: docPath, ctx });
      ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Admin plugin`);
      currentPhase = LOAD_PHASES.ADMIN;

      ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Users plugin ...}`);
      config.centers = await initCenters({ file: docPath, ctx });
      currentPhase = LOAD_PHASES.CENTERS;

      config.profiles = await initProfiles({ file: docPath, ctx });
      currentPhase = LOAD_PHASES.PROFILES;
    }

    // ·······························································
    // USERS

    if (!config.users) {
      config.users = await initUsers({
        file: docPath,
        centers: config.centers,
        profiles: config.profiles,
        ctx,
      });
      ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Users plugin`);
      currentPhase = LOAD_PHASES.USERS;
    }

    // ·······························································
    // GRADES

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Academic Rules plugin ...}`);
    config.grades = await initGrades({ file: docPath, centers: config.centers, ctx });
    ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Academic Rules plugin`);
    currentPhase = LOAD_PHASES.GRADES;

    // ·······························································
    // MEDIA LIBRARY

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Leebrary plugin ...}`);
    config.assets = await initLibrary({ file: docPath, config, ctx });

    if (shareLibraryAssetsWithTeacherProfile) {
      await shareAssetsWithProfile({
        profileId: config.profiles.teacher?.id,
        profileSysName: config.profiles.teacher?.sysName,
        assets: Object.values(config.assets),
        ctx,
      });
    }

    ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Leebrary plugin`);
    currentPhase = LOAD_PHASES.LIBRARY;

    // ·······························································
    // ACADEMIC PORTFOLIO -> Da error por duplicación de userAgentPermisions, expected & handled in academic portfolio

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Academic Portfolio plugin ...}`);
    config.programs = await initAcademicPortfolio({ file: docPath, config, skipEnrollment, ctx });
    await setTimeout(1000);
    await ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Academic Portfolio plugin`);
    currentPhase = LOAD_PHASES.AP;

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Updating Leebrary plugin with AP conf ...}`);
    await updateLibrary({ file: docPath, config, ctx });
    ctx.logger.info(chalk`{cyan.bold BULK} UPDATED Leebrary plugin`);

    // ·······························································
    // CALENDAR & KANBAN

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Calendar plugin ...}`);
    await initCalendar({ file: docPath, config, ctx });
    ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Calendar plugin`);
    currentPhase = LOAD_PHASES.CALENDAR;

    // ·······························································
    // ACADEMIC CALENDAR

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Academic Calendar plugin ...}`);
    config.regionalCalendars = await initAcademicCalendar({ file: docPath, config, ctx });

    await initProgramCalendars({ file: docPath, config, ctx });

    ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Academic Clendar plugin`);
    currentPhase = LOAD_PHASES.ACADEMIC_CALENDAR;

    // ·······························································
    // TESTS & QBANKS

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Tests plugin ...}`);
    const { tests, qbanks } = await initTests({ file: docPath, config, ctx });
    config.tests = tests;
    config.qbanks = qbanks;

    if (shareLibraryAssetsWithTeacherProfile) {
      const testsAssets = Object.values(config.tests).map((item) => item.asset);
      const qbanksAssets = Object.values(config.qbanks).map((item) => item.asset);
      await shareAssetsWithProfile({
        profileId: config.profiles.teacher?.id,
        profileSysName: config.profiles.teacher?.sysName,
        assets: [...testsAssets, ...qbanksAssets],
        ctx,
      });
    }

    ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Tests plugin`);
    currentPhase = LOAD_PHASES.TESTS;

    // ·······························································
    // TASKS

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Tasks plugin ...}`);
    config.tasks = await initTasks({ file: docPath, config, ctx });

    if (shareLibraryAssetsWithTeacherProfile) {
      const { task: tasks } = await ctx.call('tasks.tasks.getRest', {
        id: Object.values(config.tasks).map((task) => task.fullId),
      });

      const tasksAssets = tasks.map((item) => item.asset);
      await shareAssetsWithProfile({
        profileId: config.profiles.teacher?.id,
        profileSysName: config.profiles.teacher?.sysName,
        assets: [...tasksAssets], // If resources and/or statementImage change to be not-public add them here
        ctx,
      });
    }

    ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Tasks plugin`);
    currentPhase = LOAD_PHASES.TASKS;

    // ·······························································
    // WIDGETS

    await initWidgets({ ctx });
    currentPhase = LOAD_PHASES.WIDGETS;
    ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Widgets plugin`);
  }
}

module.exports = { importBulkData, getLoadStatus };
