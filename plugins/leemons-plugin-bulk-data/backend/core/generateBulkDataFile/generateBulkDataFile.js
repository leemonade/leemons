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
const { LIBRARY_CATEGORIES } = require('./config/constants');
const { createAcademicPortfolioProfilesSheet } = require('./academicPortfolioProfilesSheet');
const { createTasksSheet } = require('./tasksSheet');
const { createTaskSubjectSheet } = require('./taskSubjectSheet');
const { createTestsQBanksSheet } = require('./testsQBanksSheet');
const { createTestsQuestionsSheet } = require('./testsQuestionsSheet');
const { createTestsSheet } = require('./testsSheet');
const { createCalendarSheet } = require('./calendarSheet');

async function generateBulkDataFile({ admin, superAdmin, ctx }) {
  const workbook = new Excel.Workbook();

  await createLocalesSheet({ workbook, ctx });
  await createPlatformSheet({ workbook, ctx });
  await createProvidersSheet({ workbook }); // Creates only the template to be filled with the user credentials for all providers
  await createAppearanceSheet({ workbook, ctx });
  const centers = await createCentersSheet({ workbook, ctx });
  const users = await createUsersSheet({ workbook, centers, admin, superAdmin, ctx });
  const evaluationSystems = await createEvaluationsSheet({ workbook, centers, ctx });
  await createProfilesSheet({ workbook, centers, ctx });

  await createAcademicPortfolioProfilesSheet({ workbook, ctx });
  const subjectTypes = await createSubjectTypesSheet({ workbook, centers, ctx });
  const knowledgeAreas = await createKnowledgeAreasSheet({ workbook, centers, ctx });
  const programs = await createProgramsSheet({
    workbook,
    centers,
    evaluationSystems,
    users,
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

  const { items: libraryCategories } = await ctx.call('leebrary.categories.listRest', {});
  const allAssets = await ctx.call('leebrary.assets.getAllAssets', {
    indexable: true,
  });

  const assetsByCategoryKey = libraryCategories.reduce((acc, category) => {
    acc[category.key] = allAssets
      .filter((asset) => asset.category === category.id)
      .map((a) => ({ ...a, category: { id: a.category, key: category.key } }));
    return acc;
  }, {});

  const libraryResources = await createLibraryResourcesSheet({
    workbook,
    programs,
    subjects,
    users,
    resourceAssets: LIBRARY_CATEGORIES.map((key) => assetsByCategoryKey[key]).flat(),
    ctx,
  });

  await createTasksSheet({ workbook, ctx });
  await createTaskSubjectSheet({ workbook, ctx });
  await createTestsQBanksSheet({ workbook, ctx });
  await createTestsQuestionsSheet({ workbook, ctx });
  await createTestsSheet({ workbook, ctx });
  await createCalendarSheet({ workbook, ctx });

  await workbook.xlsx.writeFile('generated-bulk-data.xlsx');
}

module.exports = { generateBulkDataFile };

// CASO 1: nosotros (no hay usuarios) // se cargará con el endpoint existente
// CASO 2: me pasan un array con 1 teacher,estudiantes y admin/super-admin -> modificamos endpoint
