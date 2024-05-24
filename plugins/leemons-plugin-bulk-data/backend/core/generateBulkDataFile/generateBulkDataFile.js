const Excel = require('exceljs');
const { createLocalesSheet } = require('./localesSheet');
const { createPlatformSheet } = require('./platformSheet');
const { createProvidersSheet } = require('./providersSheet');
const { createCentersSheet } = require('./centersSheet');
const { createUsersSheet } = require('./usersSheet');
const { createEvaluationsSheet } = require('./evaluationsSheet');
const { createSubjectTypesSheet } = require('./subjectTypesSheet');
const { createProgramsSheet } = require('./programsSheet');
const { createKnowledgeAreasSheet } = require('./knowledgeAreasSheet');
const { createSubjectsSheet } = require('./subjectsSheet');
const { createLibraryResourcesSheet } = require('./librarySheet');
const { createProfilesSheet } = require('./profilesSheet');
const { createAppearanceSheet } = require('./appearanceSheet');
const {
  ASSET_CATEGORIES: { LIBRARY_CATEGORIES, TASKS, TESTS, TEST_QUESTION_BANKS },
} = require('./config/constants');
const { createAcademicPortfolioProfilesSheet } = require('./academicPortfolioProfilesSheet');
const { createTasksSheet, createTaskSubjectSheet } = require('./tasksSheets');
const { createTestsQBanksSheet } = require('./testsQBanksSheet');
const { createTestsQuestionsSheet } = require('./testsQuestionsSheet');
const { createTestsSheet } = require('./testsSheet');
const { createCalendarSheet } = require('./calendarSheet');
const { createRegionalCalendarsSheet } = require('./regionalCalendarsSheet');
const { createRegionalCalendarEventsSheet } = require('./regionalCalendarEventsSheets');
const {
  createProgramCalendarsSheet,
  createProgramCalendarEventsSheet,
} = require('./programCalendarSheets');

async function generateBulkDataFile({ admin, superAdmin, ctx }) {
  const workbook = new Excel.Workbook();

  // BASIC CONFIG
  await createLocalesSheet({ workbook, ctx });
  await createPlatformSheet({ workbook, ctx });
  await createProvidersSheet({ workbook }); // Creates only the template to be filled with the user credentials for all providers
  await createAppearanceSheet({ workbook, ctx });

  // USERS
  const centers = await createCentersSheet({ workbook, ctx });
  const users = await createUsersSheet({ workbook, centers, admin, superAdmin, ctx });

  // ACADEMIC CONFIGS
  const evaluationSystems = await createEvaluationsSheet({ workbook, centers, ctx });
  await createProfilesSheet({ workbook, centers, ctx });
  await createAcademicPortfolioProfilesSheet({ workbook, ctx });

  // ACADEMIC PORTFOLIO DATA
  const subjectTypes = await createSubjectTypesSheet({ workbook, centers, ctx });
  const knowledgeAreas = await createKnowledgeAreasSheet({ workbook, centers, ctx });
  const programs = await createProgramsSheet({
    workbook,
    centers,
    evaluationSystems,
    ctx,
  });
  const subjects = await createSubjectsSheet({
    workbook,
    programs,
    subjectTypes,
    knowledgeAreas,
    users,
    ctx,
  });

  // ALL ASSETS
  const { items: assetCategories } = await ctx.call('leebrary.categories.listRest', {});
  const allAssets = await ctx.call('leebrary.assets.getAllAssets', {
    indexable: true,
  });

  const assetsByCategoryKey = assetCategories.reduce((acc, category) => {
    acc[category.key] = allAssets
      .filter((asset) => asset.category === category.id)
      .map((a) => ({ ...a, category: { id: a.category, key: category.key } }));
    return acc;
  }, {});

  // LIBRARY ASSETS
  const libraryAssets = await createLibraryResourcesSheet({
    workbook,
    programs,
    subjects,
    users,
    resourceAssets: Object.values(LIBRARY_CATEGORIES)
      .map((key) => assetsByCategoryKey[key])
      .flat(),
    ctx,
  });

  // TASKS
  const tasks = await createTasksSheet({
    workbook,
    tasks: assetsByCategoryKey[TASKS],
    libraryAssets,
    programs,
    users,
    centers,
    ctx,
  });
  createTaskSubjectSheet({ workbook, tasks, subjects });

  // TESTS AND QBANKS
  const qBanks = await createTestsQBanksSheet({
    workbook,
    users,
    qBanks: assetsByCategoryKey[TEST_QUESTION_BANKS],
    programs,
    subjects,
    ctx,
  });

  const questions = await createTestsQuestionsSheet({ workbook, qBanks, ctx });
  await createTestsSheet({
    workbook,
    questions,
    tests: assetsByCategoryKey[TESTS],
    qBanks,
    programs,
    subjects,
    users,
    ctx,
  });

  // CALENDAR
  await createCalendarSheet({ workbook, users, subjects, ctx });

  // ACADEMIC CALENDAR: REGIONAL CALENDARS
  const regionalCalendars = await createRegionalCalendarsSheet({ workbook, centers, ctx });
  createRegionalCalendarEventsSheet({ workbook, regionalCalendars, ctx });

  const programCalendars = await createProgramCalendarsSheet({ workbook, programs, ctx });
  createProgramCalendarEventsSheet({ workbook, programCalendars, ctx });

  await workbook.xlsx.writeFile('generated-bulk-data.xlsx');
}

module.exports = { generateBulkDataFile };

// CASO 1: nosotros (no hay usuarios) // se cargará con el endpoint existente
// CASO 2: me pasan un array con 1 teacher,estudiantes y admin/super-admin -> modificamos endpoint

// TODO@PAOLA: implementar academic calendar en import y export (ver screenshot the payload crear regional config => "Barcelona")
// TODO@PAOLA: preguntas con mapas. crear convención. updade del import
