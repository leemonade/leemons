const Excel = require('exceljs');
const { uniqBy } = require('lodash');

const { createAcademicPortfolioProfilesSheet } = require('./academicPortfolioProfilesSheet');
const { createAppearanceSheet } = require('./appearanceSheet');
const { createCalendarSheet } = require('./calendarSheet');
const { createCentersSheet } = require('./centersSheet');
const {
  ASSET_CATEGORIES: {
    LIBRARY_CATEGORIES,
    TASKS,
    TESTS,
    TEST_QUESTION_BANKS,
    CONTENT_CREATOR,
    LEARNING_PATHS_MODULE,
  },
} = require('./config/constants');
const { createContentCreatorSheet } = require('./contentCreatorSheet');
const { createEvaluationsSheet } = require('./evaluationsSheet');
const { createKnowledgeAreasSheet } = require('./knowledgeAreasSheet');
const { createLibraryResourcesSheet } = require('./librarySheet');
const { createLocalesSheet } = require('./localesSheet');
const { createModulesSheet } = require('./modulesSheet');
const { createNonIndexableLibraryAssetsSheet } = require('./nonIndexableLibraryAssetsSheet');
const { createPlatformSheet } = require('./platformSheet');
const { createProfilesSheet } = require('./profilesSheet');
const {
  createProgramCalendarsSheet,
  createProgramCalendarEventsSheet,
} = require('./programCalendarSheets');
const { createProgramsSheet } = require('./programsSheet');
const { createProvidersSheet } = require('./providersSheet');
const { createRegionalCalendarEventsSheet } = require('./regionalCalendarEventsSheets');
const { createRegionalCalendarsSheet } = require('./regionalCalendarsSheet');
const { createSubjectTypesSheet } = require('./subjectTypesSheet');
const { createSubjectsSheet } = require('./subjectsSheet');
const { createTasksSheet, createTaskSubjectSheet } = require('./tasksSheets');
const { createTestsQBanksSheet } = require('./testsQBanksSheet');
const { createTestsQuestionsSheet } = require('./testsQuestionsSheet');
const { createTestsSheet } = require('./testsSheet');
const { createUsersSheet } = require('./usersSheet');

async function filterQbanksByRequiredByTestAndVersion({ detailedTests, qBanks, ctx }) {
  const versionControlledQbankIds = await ctx.call('leebrary.assets.filterByVersionOfType', {
    assetIds: qBanks.map((a) => a.id),
    categoryId: qBanks?.[0]?.category?.id,
  });

  const allQBankDetails = await ctx.call('leebrary.assets.getByIds', {
    ids: qBanks.map((a) => a.id),
    shouldPrepareAssets: true,
    signedURLExpirationTime: 7 * 24 * 60 * 60,
    withFiles: true,
  });

  const qBanksNeeded = [];
  detailedTests.forEach((test) => {
    const questionBank = allQBankDetails.find(
      (qBank) => qBank.providerData.id === test.providerData.metadata.questionBank
    );
    qBanksNeeded.push(questionBank);
  });

  // Add last version of any qbank regardless if it's used in a test or not
  versionControlledQbankIds.forEach((latestVersionOfQBank) => {
    const match = qBanksNeeded.find((qBank) => qBank.id === latestVersionOfQBank.id);
    if (!match) {
      qBanksNeeded.push(allQBankDetails.find((qBank) => qBank.id === latestVersionOfQBank));
    }
  });

  const filteredQBankDetails = uniqBy(qBanksNeeded, 'id').map((item) => ({
    ...item,
    hideInLibrary: !versionControlledQbankIds.includes(item.id),
  }));

  return { filteredQBankDetails };
}

function filterAssetsByRequiredByModuleAndVersion({
  modules = [],
  items,
  versionControlledItemIds,
}) {
  const neededAssets = [];
  const seenIds = new Set();
  const versionControlledSet = new Set(versionControlledItemIds);

  items.forEach((item) => {
    const isNeededForModule =
      modules.some((module) =>
        module.providerData.submission.activities
          .map(({ activity }) => activity)
          .includes(item.providerData.id)
      ) && !seenIds.has(item.id);

    const isLastVersionOfAsset = versionControlledSet.has(item.id) && !seenIds.has(item.id);

    if (isNeededForModule || isLastVersionOfAsset) {
      neededAssets.push(item);
      seenIds.add(item.id);
    }
  });

  return neededAssets.map((item) => ({
    ...item,
    hideInLibrary: !versionControlledSet.has(item.id),
  }));
}

async function getAssignablesData({
  tests,
  tasks,
  cCreatorDocuments,
  modules = [],
  categories,
  ctx,
}) {
  const filterAssetsByVersionOfTypeService = 'leebrary.assets.filterByVersionOfType';
  const getAssetsByIdsService = 'leebrary.assets.getByIds';

  // MODULES
  const versionConrolledModuleIds = await ctx.call(filterAssetsByVersionOfTypeService, {
    assetIds: modules.map((a) => a.id),
    categoryId: modules?.[0]?.category?.id,
  });
  const filteredModuleDetails = await ctx.call(getAssetsByIdsService, {
    ids: versionConrolledModuleIds,
    shouldPrepareAssets: true,
    withFiles: true,
  });

  // ALL OTHER ASSIGNABLES
  const allAssetIds = [...tests, ...tasks, ...cCreatorDocuments].map((a) => a.id);
  const allAssetDetails = await ctx.call(getAssetsByIdsService, {
    ids: allAssetIds,
    shouldPrepareAssets: true,
    withFiles: true,
  });

  const versionControlledTestIds = await ctx.call(filterAssetsByVersionOfTypeService, {
    assetIds: tests.map((a) => a.id),
    categoryId: tests?.[0]?.category?.id,
  });
  const versionControlledTaskIds = await ctx.call(filterAssetsByVersionOfTypeService, {
    assetIds: tasks.map((a) => a.id),
    categoryId: tasks?.[0]?.category?.id,
  });
  const versionControlledDocumentIds = await ctx.call(filterAssetsByVersionOfTypeService, {
    assetIds: cCreatorDocuments.map((a) => a.id),
    categoryId: cCreatorDocuments?.[0]?.category?.id,
  });

  // FILTER BY MODULE DEPENDENCY AND LAST VERSION
  const filteredDetailedAssets = filterAssetsByRequiredByModuleAndVersion({
    modules: filteredModuleDetails,
    items: allAssetDetails,
    versionControlledItemIds: [
      ...versionControlledTestIds,
      ...versionControlledTaskIds,
      ...versionControlledDocumentIds,
    ],
  });

  const filteredTestDetails = filteredDetailedAssets.filter(
    (item) => item.category === categories.find((c) => c.key === TESTS).id
  );
  const filteredTaskDetails = filteredDetailedAssets.filter(
    (item) => item.category === categories.find((c) => c.key === TASKS).id
  );
  const filteredDocumentDetails = filteredDetailedAssets.filter(
    (item) => item.category === categories.find((c) => c.key === CONTENT_CREATOR).id
  );

  return {
    filteredModuleDetails,
    filteredTestDetails,
    filteredTaskDetails,
    filteredDocumentDetails,
  };
}

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

  // TODO: New features will need to handle the activities and qbansk that might be created as not indexable when exporting from a previously imported bulk-data
  // these not indexable assets are use to handle versions needed by other assets (i.e.: Modules using a previouse version of a task, Tests using previous versions of a qbank)

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

  const {
    filteredModuleDetails,
    filteredTestDetails,
    filteredTaskDetails,
    filteredDocumentDetails,
  } = await getAssignablesData({
    tests: assetsByCategoryKey[TESTS],
    tasks: assetsByCategoryKey[TASKS],
    cCreatorDocuments: assetsByCategoryKey[CONTENT_CREATOR],
    modules: assetsByCategoryKey[LEARNING_PATHS_MODULE],
    libraryAssetActivities: assetsByCategoryKey[LIBRARY_CATEGORIES],
    categories: assetCategories,
    ctx,
  });

  // CONTENT CREATOR
  const cCreatorDocuments = await createContentCreatorSheet({
    workbook,
    documentDetails: filteredDocumentDetails,
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
    taskDetails: filteredTaskDetails,
    libraryAssets,
    adminShouldOwnAllAssets,
    programs,
    users,
    centers,
    ctx,
  });
  createTaskSubjectSheet({ workbook, tasks, subjects });

  // TESTS AND QBANKS
  const { filteredQBankDetails } = await filterQbanksByRequiredByTestAndVersion({
    detailedTests: filteredTestDetails,
    qBanks: assetsByCategoryKey[TEST_QUESTION_BANKS],
    ctx,
  });

  const qBanks = createTestsQBanksSheet({
    workbook,
    users,
    qBankDetails: filteredQBankDetails,
    adminShouldOwnAllAssets,
    programs,
    subjects,
    libraryAssets,
    ctx,
  });

  const questions = await createTestsQuestionsSheet({ workbook, qBanks, ctx });
  const tests = await createTestsSheet({
    workbook,
    questions,
    testDetails: filteredTestDetails,
    qBanks,
    adminShouldOwnAllAssets,
    programs,
    subjects,
    users,
    ctx,
  });

  // MODULES
  await createModulesSheet({
    workbook,
    moduleDetails: filteredModuleDetails,
    tests,
    tasks,
    libraryAssets,
    cCreatorDocuments,
    adminShouldOwnAllAssets,
    programs,
    subjects,
    users,
    nonIndexableAssetsNeeded,
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
