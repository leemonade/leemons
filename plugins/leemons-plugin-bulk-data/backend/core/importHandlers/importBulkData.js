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
const { getCurrentPhaseKey, getLastPhaseOnErrorKey } = require('../../helpers/cacheKeys');
const { LOAD_PHASES, LOAD_ERROR } = require('./getLoadStatus');
const { getLoadStatus } = require('.');
const { initContentCreator } = require('../contentCreator');
const initModules = require('../modules');

let currentPhaseLocal = null;
let lastPhaseOnErrorLocal = null;

async function getStatusWhenLocal() {
  return getLoadStatus({
    localCurrentPhase: currentPhaseLocal,
    localLastPhaseOnError: lastPhaseOnErrorLocal,
    useCache: false,
  });
}

async function shareAssetsWithProfile({ profileId, assets, forcedIsPublicValue, ctx }) {
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
        isPublic: forcedIsPublicValue ?? !!asset.public,
      })
    );
  });

  await Promise.all(promises);
}

async function importBulkData({
  docPath,
  preConfig = {},
  shareLibraryAssetsWithTeacherProfile,
  useCache = true,
  onFinishData = {},
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

  currentPhaseLocal = null;

  const currentPhaseKey = getCurrentPhaseKey(ctx);
  await ctx.cache.set(currentPhaseKey, LOAD_PHASES.LOCALES, 60 * 60);

  try {
    if (fs.existsSync(docPath)) {
      // ································································
      // APP INITIALIZATION

      if (!skipAppInitialization) {
        // ·······························································
        // LOCALES

        ctx.logger.debug(chalk`{cyan.bold BULK} {gray Init Platform & locales ...}`);
        await initLocales({ file: docPath, ctx });
        currentPhaseLocal = LOAD_PHASES.LOCALES;

        await initPlatform({ file: docPath, ctx });
        ctx.logger.info(chalk`{cyan.bold BULK} Platform initialized`);
        currentPhaseLocal = LOAD_PHASES.PLATFORM;

        // ·······························································
        // PROVIDERS

        ctx.logger.debug(chalk`{cyan.bold BULK} {gray Init Providers ...}`);
        await initProviders({ file: docPath, ctx });
        ctx.logger.info(chalk`{cyan.bold BULK} Providers initialized`);
        currentPhaseLocal = LOAD_PHASES.PROVIDERS;

        // ·······························································
        // CENTERS, PROFILES

        ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Admin plugin ...}`);
        await initAdmin({ file: docPath, ctx });
        ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Admin plugin`);
        currentPhaseLocal = LOAD_PHASES.ADMIN;

        ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Users plugin ...}`);
        config.centers = await initCenters({ file: docPath, ctx });
        currentPhaseLocal = LOAD_PHASES.CENTERS;

        config.profiles = await initProfiles({ file: docPath, ctx });
        currentPhaseLocal = LOAD_PHASES.PROFILES;
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
        currentPhaseLocal = LOAD_PHASES.USERS;
      }

      // ·······························································
      // GRADES

      ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Academic Rules plugin ...}`);
      config.grades = await initGrades({ file: docPath, centers: config.centers, ctx });
      ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Academic Rules plugin`);
      currentPhaseLocal = LOAD_PHASES.GRADES;
      if (useCache) await ctx.cache.set(currentPhaseKey, LOAD_PHASES.GRADES, 60 * 60);

      // ·······························································
      // MEDIA LIBRARY

      ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Leebrary plugin ...}`);
      const { assets, nonIndexableAssets } = await initLibrary({
        file: docPath,
        config,
        useCache,
        phaseKey: currentPhaseKey,
        ctx,
      });
      config.assets = assets;
      config.nonIndexableAssets = nonIndexableAssets;

      if (shareLibraryAssetsWithTeacherProfile) {
        await shareAssetsWithProfile({
          profileId: config.profiles.teacher?.id,
          profileSysName: config.profiles.teacher?.sysName,
          assets: Object.values(config.assets),
          ctx,
        });
      }

      ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Leebrary plugin`);
      currentPhaseLocal = LOAD_PHASES.LIBRARY;
      if (useCache) await ctx.cache.set(currentPhaseKey, LOAD_PHASES.LIBRARY, 60 * 60);

      // ·······························································
      // ACADEMIC PORTFOLIO -> Da error por duplicación de userAgentPermisions, expected & handled in academic portfolio

      ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Academic Portfolio plugin ...}`);
      config.programs = await initAcademicPortfolio({ file: docPath, config, skipEnrollment, ctx });
      await setTimeout(1000);
      await ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Academic Portfolio plugin`);
      currentPhaseLocal = LOAD_PHASES.ACADEMIC_PORTFOLIO;
      await ctx.cache.set(currentPhaseKey, LOAD_PHASES.ACADEMIC_PORTFOLIO, 60 * 60);

      ctx.logger.debug(chalk`{cyan.bold BULK} {gray Updating Leebrary plugin with AP conf ...}`);
      await updateLibrary({ file: docPath, config, ctx });
      ctx.logger.info(chalk`{cyan.bold BULK} UPDATED Leebrary plugin`);

      // ·······························································
      // CALENDAR & KANBAN

      ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Calendar plugin ...}`);
      await initCalendar({ file: docPath, config, ctx });
      ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Calendar plugin`);
      currentPhaseLocal = LOAD_PHASES.CALENDAR;
      if (useCache) await ctx.cache.set(currentPhaseKey, LOAD_PHASES.CALENDAR, 60 * 60);

      // ·······························································
      // ACADEMIC CALENDAR

      ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Academic Calendar plugin ...}`);
      config.regionalCalendars = await initAcademicCalendar({ file: docPath, config, ctx });

      await initProgramCalendars({ file: docPath, config, ctx });

      ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Academic Clendar plugin`);
      currentPhaseLocal = LOAD_PHASES.ACADEMIC_CALENDAR;
      if (useCache) await ctx.cache.set(currentPhaseKey, LOAD_PHASES.ACADEMIC_CALENDAR, 60 * 60);

      // ·······························································
      // CONTENT CREATOR
      ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Content Creator plugin ...}`);
      config.contentCreatorDocs = await initContentCreator({ file: docPath, config, ctx });

      if (
        shareLibraryAssetsWithTeacherProfile &&
        Object.keys(config.contentCreatorDocs || {})?.length
      ) {
        const documents = Object.values(config.contentCreatorDocs);

        await shareAssetsWithProfile({
          profileId: config.profiles.teacher?.id,
          profileSysName: config.profiles.teacher?.sysName,
          assets: documents.map((doc) => doc.asset),
          ctx,
        });
      }

      ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Content Creator plugin`);
      currentPhaseLocal = LOAD_PHASES.CONTENT_CREATOR;
      if (useCache) await ctx.cache.set(currentPhaseKey, LOAD_PHASES.CONTENT_CREATOR, 60 * 60);

      // ·······························································
      // TESTS & QBANKS

      ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Tests plugin ...}`);
      const { tests, qbanks } = await initTests({
        file: docPath,
        config,
        ctx,
        useCache,
        phaseKey: currentPhaseKey,
      });
      config.tests = tests;
      config.qbanks = qbanks;

      if (shareLibraryAssetsWithTeacherProfile) {
        const testAssets = Object.values(config.tests).map((item) => item.asset);
        const qbankAssets = Object.values(config.qbanks).map((item) => item.asset);
        await shareAssetsWithProfile({
          profileId: config.profiles.teacher?.id,
          profileSysName: config.profiles.teacher?.sysName,
          assets: [...testAssets, ...qbankAssets],
          forcedIsPublicValue: true, // Test & qbank assets are public by creation; we don't have access to the asset object here
          ctx,
        });
      }

      ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Tests plugin`);
      currentPhaseLocal = LOAD_PHASES.TESTS;
      if (useCache) await ctx.cache.set(currentPhaseKey, LOAD_PHASES.TESTS, 60 * 60);

      // ·······························································
      // TASKS

      ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Tasks plugin ...}`);
      config.tasks = await initTasks({
        file: docPath,
        config,
        ctx,
        useCache,
        phaseKey: currentPhaseKey,
      });

      if (shareLibraryAssetsWithTeacherProfile) {
        const { task: tasks } = await ctx.call('tasks.tasks.getRest', {
          id: Object.values(config.tasks).map((task) => task.fullId),
        });

        const taskAssets = tasks.map((item) => item.asset);
        await shareAssetsWithProfile({
          profileId: config.profiles.teacher?.id,
          profileSysName: config.profiles.teacher?.sysName,
          assets: [...taskAssets], // If resources and/or statementImage change to be not-public add them here
          ctx,
        });
      }

      ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Tasks plugin`);
      currentPhaseLocal = LOAD_PHASES.TASKS;
      if (useCache) await ctx.cache.set(currentPhaseKey, LOAD_PHASES.TASKS, 60 * 60);

      // ·······························································
      // MODULES
      // TO IMPLEMENT: Finish modules import making sure duplication -> assignation -> execution works correctly
      // TO IMPLEMENT:: Finish modules import making sure ccreator documents can be correctly used as module resources
      // TO IMPLEMENT:: Add correspoinding load phase and update possible translations needed in Client Manager

      /*
      config.modules = await initModules({ file: docPath, config, ctx });

      if (shareLibraryAssetsWithTeacherProfile) {
        const moduleAssets = Object.values(config.modules).map((item) => item.asset);

        await shareAssetsWithProfile({
          profileId: config.profiles.teacher?.id,
          profileSysName: config.profiles.teacher?.sysName,
          assets: moduleAssets,
          ctx,
        });
      }

      ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Modules plugin`);
      currentPhaseLocal = LOAD_PHASES.MODULES;
      if (useCache) await ctx.cache.set(currentPhaseKey, LOAD_PHASES.MODULES, 60 * 60);
      */

      // ······························································
      // WIDGETS

      await initWidgets({ ctx });
      currentPhaseLocal = LOAD_PHASES.WIDGETS;
      ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Widgets plugin`);
      if (useCache) await ctx.cache.set(currentPhaseKey, LOAD_PHASES.WIDGETS, 60 * 60);

      // ·······························································
      // FINISH

      ctx.emit('finish-load-template', {
        ...onFinishData,
        caller: ctx.callerPlugin,
      });
    }
  } catch (error) {
    console.error('Error in importBulkData =>', error);
    const lastPhaseOnErrorKey = getLastPhaseOnErrorKey(ctx);
    if (useCache) await ctx.cache.set(lastPhaseOnErrorKey, currentPhaseLocal, 60 * 60);
    if (useCache) await ctx.cache.set(currentPhaseKey, LOAD_ERROR, 60 * 60);

    lastPhaseOnErrorLocal = currentPhaseLocal;
    currentPhaseLocal = LOAD_ERROR;
    throw error;
  }
}

module.exports = { importBulkData, getStatusWhenLocal };
