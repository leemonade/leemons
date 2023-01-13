const _ = require('lodash');
const path = require('path');
const initPlatform = require('../src/platform');
const initProviders = require('../src/providers');
const initAdmin = require('../src/admin');
const initUsers = require('../src/users');
const initCenters = require('../src/centers');
const initLocales = require('../src/locales');
const initProfiles = require('../src/profiles');
const initGrades = require('../src/grades');
const initAcademicPortfolio = require('../src/academicPortfolio');
const { initLibrary } = require('../src/leebrary');
const initWidgets = require('../src/widgets');
const importSubjects = require('../src/bulk/academic-portfolio/subjects');

function getNextGroupName(name) {
  const split = name.split('G');
  const start = split[0];
  const digits = split[1];
  const n = parseInt(digits, 10);
  return `${start}G${_.padStart((n + 1).toString(), digits.length, '0')}`;
}

async function loadData(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      n_groups: { type: 'number' },
      n_students: { type: 'number' },
    },
    required: ['n_groups', 'n_students'],
    additionalProperties: true,
  });
  if (validator.validate(ctx.request.body)) {
    const { chalk } = global.utils;
    const docPath = path.resolve(__dirname, '../stress_base.xlsx');

    // ·······························································
    // PLATFORM & LOCALES

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Init Platform & locales ...}`);

    // await initLocales(docPath);
    await initPlatform(docPath);

    leemons.log.info(chalk`{cyan.bold BULK} Platform initialized`);

    // ·······························································
    // PROVIDERS

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Init Providers ...}`);

    await initProviders(docPath);

    leemons.log.info(chalk`{cyan.bold BULK} Providers initialized`);

    // ·······························································
    // CENTERS, PROFILES & USERS

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Users plugin ...}`);

    const centers = await initCenters(docPath);
    const profiles = await initProfiles(docPath);
    const users = await initUsers(docPath, centers, profiles);

    leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Users plugin`);

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Academic Rules plugin ...}`);

    const grades = await initGrades(docPath, centers);

    leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Academic Rules plugin`);

    // ·······························································
    // ACADEMIC PORTFOLIO

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Academic Portfolio plugin ...}`);

    const { programs, knowledgeAreas, subjectTypes, weekdays } = await initAcademicPortfolio(
      docPath,
      { centers, profiles, users, grades },
      true,
      true
    );

    const subjects = await importSubjects(docPath, {
      programs,
      knowledgeAreas,
      subjectTypes,
      users,
      weekdays,
    });

    console.dir(subjects, { depth: null });

    leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Academic Portfolio plugin`);

    // ·······························································
    // MEDIA LIBRARY
    /*
    leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Leebrary plugin ...}`);

    const assets = await initLibrary(docPath, { users });

    leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Leebrary plugin`);
    */

    ctx.status = 200;
    ctx.body = { status: 200, subjects };
  } else {
    throw validator.error;
  }
}

module.exports = { load: loadData };
