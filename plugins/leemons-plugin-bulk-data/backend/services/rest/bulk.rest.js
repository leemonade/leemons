const fs = require('fs');
const chalk = require('chalk');
const { setTimeout } = require('timers/promises');
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
const { generateBulkDataFile } = require('../../core/generateBulkDataFile');

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

function getLoadStatus() {
  const progress = getLoadProgress();

  return {
    status: 200,
    currentPhase: String(currentPhase).toUpperCase(),
    overallProgress: `${progress} %`,
  };
}

async function bulkData({ docPath, ctx }) {
  currentPhase = null;
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
    // CENTERS, PROFILES & USERS

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
    // MEDIA LIBRARY

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Leebrary plugin ...}`);
    config.assets = await initLibrary({ file: docPath, config, ctx });
    ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Leebrary plugin`);
    currentPhase = LOAD_PHASES.LIBRARY;

    // ·······························································
    // ACADEMIC PORTFOLIO -> Da error por duplicación de userAgentPermisions, expected & handled in academic portfolio

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Academic Portfolio plugin ...}`);
    config.programs = await initAcademicPortfolio({ file: docPath, config, ctx });
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
    // TESTS & QBANKS

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Tests plugin ...}`);
    config.tests = await initTests({ file: docPath, config, ctx });
    ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Tests plugin`);
    currentPhase = LOAD_PHASES.TESTS;

    // ·······························································
    // TASKS

    ctx.logger.debug(chalk`{cyan.bold BULK} {gray Starting Tasks plugin ...}`);
    config.tasks = await initTasks({ file: docPath, config, ctx });
    ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Tasks plugin`);
    currentPhase = LOAD_PHASES.TASKS;

    // ·······························································
    // WIDGETS

    await initWidgets({ ctx });
    currentPhase = LOAD_PHASES.WIDGETS;
    ctx.logger.info(chalk`{cyan.bold BULK} COMPLETED Widgets plugin`);
  }
}

async function loadFromFile(ctx, { isAsync = false }) {
  const settings = await ctx.call('admin.settings.findOne');

  try {
    if (settings?.status !== 'INSTALLED' && !settings?.configured) {
      const file = await createTempFile({ readStream: ctx.params });
      if (isAsync) {
        bulkData({ docPath: file.path, ctx });
        return { status: 200, currentPhase: 'Proccessing file', overallProgress: '0%' };
      }
      await bulkData({ docPath: file.path, ctx });
      return { status: 200 };
    }
  } catch (error) {
    throw new LeemonsError(ctx, {
      message: `Something went wrong: ${error}`,
      httpStatusCode: 500,
    });
  }
  throw new LeemonsError(ctx, { message: 'Unexpected error', httpStatusCode: 500 });
}

module.exports = {
  loadRest: {
    rest: {
      path: '/load-from-file',
      method: 'POST',
      type: 'multipart',
    },
    timeout: 0,
    async handler(ctx) {
      // This should accept a param that indicates it's needed to get the admin data from the user session
      // Cases where the bulk data file is loaded from an admin profile
      // It also needs to be modified so that it accepts an array of users: 1 teacher and many students
      return loadFromFile(ctx, { isAsync: true });
    },
  },
  loadRestSync: {
    rest: {
      path: '/load-from-file-sync',
      method: 'POST',
      type: 'multipart',
    },
    timeout: 0,
    async handler(ctx) {
      return loadFromFile(ctx, { isAsync: false });
    },
  },
  statusRest: {
    rest: {
      path: '/load-from-file',
      method: 'GET',
    },
    handler() {
      return getLoadStatus();
    },
  },
  generateBulkDataRest: {
    rest: {
      path: '/generate-bulk-data',
      method: 'POST',
    },

    async handler(ctx) {
      const { admin, superAdmin } = ctx.params;
      const result = await generateBulkDataFile({ admin, superAdmin, ctx });
      return { status: 200, result };
    },
  },
};

// TODO CREAR CALENDARIOS REGIONALES - antes de academicPortfolioInit
// TODO EDITAR CALENDARIO DE PROGRAMA PARA QUE APUNTE AL CALENDARIO REGIONAL DESEADO - al final
// TODO RECORDAR QUE LA TAB ac_program ya no deberá exister (el programa automaticamente emite evento para creación de program calendar)

/*
PAYLOAD DE EDICIÓN DE CALENDARIO DE PROGRAMA academic-calendar/config
{
    "regionalConfig": "lrn:local:academic-calendar:local:66488a7da904f74425c70742:RegionalConfig:664e05ed94a7a77c83b0f036", //
    "allCoursesHaveSameDates": false,
    "breaks": [
        {
            "name": "recreo",
            "startDate": "2024-05-22T07:30:00.000Z",
            "endDate": "2024-05-22T08:30:00.000Z",
            "courses": [
                "lrn:local:academic-portfolio:local:66488a7da904f74425c70742:Groups:66488aa01a368c2077393b9d"
            ]
        }
    ],
    "courseDates": {
        "lrn:local:academic-portfolio:local:66488a7da904f74425c70742:Groups:66488aa01a368c2077393b9d": {
            "startDate": "2024-04-30T22:00:00.000Z",
            "endDate": "2024-05-30T22:00:00.000Z"
        }
    },
    "substagesDates": {
        "lrn:local:academic-portfolio:local:66488a7da904f74425c70742:Groups:66488aa01a368c2077393b9d": {}
    },
    "courseEvents": {
        "lrn:local:academic-portfolio:local:66488a7da904f74425c70742:Groups:66488aa01a368c2077393b9d": []
    },
    "program": "lrn:local:academic-portfolio:local:66488a7da904f74425c70742:Programs:66488aa01a368c2077393b82" // identificador de programa en ProgramCalendar
}
*/
