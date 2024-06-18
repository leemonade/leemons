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
  ASSET_CATEGORIES: { LIBRARY_CATEGORIES, TASKS, TESTS, TEST_QUESTION_BANKS, CONTENT_CREATOR },
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
const { createContentCreatorSheet } = require('./contentCreatorSheet');
const { createNonIndexableLibraryAssetsSheet } = require('./nonIndexableLibraryAssetsSheet');

async function generateBulkDataFile({
  admin,
  superAdmin,
  noUsers = false,
  isClientManagerTemplate = false,
  writeFileLocally = true,
  ctx,
}) {
  const adminShouldOwnAllAssets = isClientManagerTemplate && noUsers;
  const nonIndexableAssetsNeeded = [];

  const workbook = new Excel.Workbook();

  ctx.meta = { ...ctx.meta, leebrary: { signedURLExpireSeconds: 7 * 24 * 60 * 60 } };

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
    adminShouldOwnAllAssets,
    resourceAssets: Object.values(LIBRARY_CATEGORIES)
      .map((key) => assetsByCategoryKey[key])
      .flat(),
    ctx,
  });

  // CONTENT CREATOR
  await createContentCreatorSheet({
    workbook,
    documents: assetsByCategoryKey[CONTENT_CREATOR],
    libraryAssets,
    programs,
    adminShouldOwnAllAssets,
    subjects,
    users,
    nonIndexableAssetsNeeded,
    ctx,
  });

  // TASKS
  const tasks = await createTasksSheet({
    workbook,
    tasks: assetsByCategoryKey[TASKS],
    libraryAssets,
    adminShouldOwnAllAssets,
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
    adminShouldOwnAllAssets,
    programs,
    subjects,
    libraryAssets,
    ctx,
  });

  const questions = await createTestsQuestionsSheet({ workbook, qBanks, ctx });
  await createTestsSheet({
    workbook,
    questions,
    tests: assetsByCategoryKey[TESTS],
    qBanks,
    adminShouldOwnAllAssets,
    programs,
    subjects,
    users,
    ctx,
  });

  // CALENDAR
  await createCalendarSheet({ workbook, users, subjects, noUsers, ctx });

  // ACADEMIC CALENDAR: REGIONAL CALENDARS
  const regionalCalendars = await createRegionalCalendarsSheet({ workbook, centers, ctx });
  createRegionalCalendarEventsSheet({ workbook, regionalCalendars, ctx });

  const programCalendars = await createProgramCalendarsSheet({
    workbook,
    programs,
    regionalCalendars,
    ctx,
  });
  createProgramCalendarEventsSheet({ workbook, programCalendars, ctx });

  await createNonIndexableLibraryAssetsSheet({
    workbook,
    programs,
    subjects,
    adminShouldOwnAllAssets,
    nonIndexableAssets: nonIndexableAssetsNeeded.map((item) => ({
      ...item,
      categoryKey: assetCategories.find((category) => category.id === item.asset.category).key,
    })),
    users,
    ctx,
  });

  if (writeFileLocally) {
    await workbook.xlsx.writeFile('generated-bulk-data.xlsx');
    return 'generated-bulk-data.xlsx';
  }

  return workbook.xlsx.writeBuffer();
}

module.exports = { generateBulkDataFile };
