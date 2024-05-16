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

async function generateBulkDataFile({ admin, superAdmin, ctx }) {
  const workbook = new Excel.Workbook();

  // cuando un asset es publico en file.url

  await createLocalesSheet({ workbook, ctx });
  await createPlatformSheet({ workbook, ctx });
  await createProvidersSheet({ workbook }); // Creates only the template to be filled with the user credentials for all providers
  // TODO: await createAppearanceSettingsSheet({workbook, ctx})
  const centers = await createCentersSheet({ workbook, ctx });
  const users = await createUsersSheet({ workbook, centers, admin, superAdmin, ctx });
  const evaluationSystems = await createEvaluationsSheet({ workbook, centers, ctx });
  const profiles = await createProfilesSheet({ workbook, centers, ctx });

  const subjectTypes = await createSubjectTypesSheet({ workbook, centers, ctx });
  const knowledgeAreas = await createKnowledgeAreasSheet({ workbook, centers, ctx });
  const programs = await createProgramsSheet({
    workbook,
    centers,
    evaluationSystems,
    users,
    ctx,
  });
  await createSubjectsSheet({ workbook, programs, subjectTypes, knowledgeAreas, users, ctx });

  // TODO: create subjects sheet
  // TODO: Finish library sheet after programs and subjects as it needs bulk ids for them
  // await createLibraryResourcesSheet({ workbook, ctx });

  await workbook.xlsx.writeFile('generated-bulk-data.xlsx');
}

module.exports = { generateBulkDataFile };

// CASO 1: nosotros (no hay usuarios) // se cargará con el endpoint existente
// CASO 2: me pasan un array con 1 teacher,estudiantes y admin/super-admin -> modificamos endpoint
