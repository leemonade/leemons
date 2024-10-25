const _ = require('lodash');
const TurndownService = require('turndown');

const {
  configureSheetColumns,
  booleanToYesNoAnswer,
  getDuplicatedAssetsReferenceAsString,
} = require('../helpers');

const { TASK_COLUMN_DEFINITIONS } = require('./columnDefinitions');

const turndown = new TurndownService();

// HELPER FUNCTIONS ·······················································································|

const getMetadataString = (task, libraryAssets, notIndexableAssets) => {
  const {
    leebrary,
    express,
    hasDevelopment,
    visitedSteps,
    hasAttachments,
    hasInstructions,
    hasCustomObjectives,
  } = task.providerData.metadata;

  const processedHasDevelopment = booleanToYesNoAnswer(!!hasDevelopment);
  const processedVisitedSteps = visitedSteps?.join('&') || 'basicData';
  const processedExpress = booleanToYesNoAnswer(!!express);
  const processedHasAttachments = booleanToYesNoAnswer(!!hasAttachments);
  const prcessedHasInstructions = booleanToYesNoAnswer(!!hasInstructions);
  const processedHasCustomObjectives = booleanToYesNoAnswer(!!hasCustomObjectives);

  let processedStatementImage;
  const statementImage = leebrary?.statementImage?.[0];
  if (statementImage) {
    const statementImageAsset = notIndexableAssets.find((asset) => asset.id === statementImage);
    processedStatementImage = getDuplicatedAssetsReferenceAsString({
      libraryAssets,
      dups: [statementImageAsset],
    });
  }

  const result = [];
  result.push(`hasDevelopment|${processedHasDevelopment}`);
  result.push(`hasAttachments|${processedHasAttachments}`);
  result.push(`express|${processedExpress}`);
  result.push(`hasInstructions|${prcessedHasInstructions}`);
  result.push(`hasCustomObjectives|${processedHasCustomObjectives}`);
  result.push(`visitedSteps|${processedVisitedSteps}`);

  if (processedStatementImage) {
    result.push(`statementImage|${processedStatementImage}`);
  }

  return result.join(', ');
};

const getCenter = (centers, task, taskProgram) => {
  if (task.providerData.center) {
    return centers.find((item) => item.id === task.providerData.center)?.bulkId || '';
  }
  return taskProgram?.centerBulkId || '';
};

const getCreator = (taskAsset, users) => users.find((u) => u.id === taskAsset.fromUser)?.bulkId;

// NOTE => Currently, no library asset tags are added from the editor
const getDevelopmentString = (task) =>
  turndown.turndown(task.providerData.metadata?.development?.[0]?.development ?? '');

// MAIN FUNCTION ······································································|

async function createTasksSheet({
  workbook,
  libraryAssets,
  adminShouldOwnAllAssets,
  taskDetails,
  programs,
  centers,
  users,
  ctx,
}) {
  const worksheet = workbook.addWorksheet('ta_tasks');
  configureSheetColumns({ worksheet, columnDefinitions: TASK_COLUMN_DEFINITIONS });

  const notIndexableAssetIds = taskDetails.reduce((acc, task) => {
    const statementImageId = task.providerData.metadata.leebrary?.statementImage?.[0];
    const imageInLibraryAssets = libraryAssets.find((item) => item.id === statementImageId);
    if (statementImageId && !imageInLibraryAssets) {
      acc.push(statementImageId);
    }

    const resources = task.providerData?.resources;
    if (resources?.length) {
      resources.forEach((element) => {
        const resourceInLibraryAssets = libraryAssets.find((item) => item.id === element);
        if (!resourceInLibraryAssets) {
          acc.push(element);
        }
      });
    }

    return acc;
  }, []);

  const notIndexableAssets = await ctx.call('leebrary.assets.getByIds', {
    ids: notIndexableAssetIds,
    shouldPrepareAssets: true,
    withFiles: true,
  });

  return taskDetails.map((task, index) => {
    const taskResourceAssets = task.providerData.resources.map((id) =>
      notIndexableAssets.find((asset) => asset.id === id)
    );
    const resourcesString = getDuplicatedAssetsReferenceAsString({
      libraryAssets,
      dups: taskResourceAssets,
    });
    const development = getDevelopmentString(task);

    // HANDLE HTML TO MARKDOWN
    const statementMarkdown = turndown.turndown(task.providerData.statement ?? '');
    const instructionsForStudentsMarkdown = turndown.turndown(
      task.providerData.instructionsForStudents ?? ''
    );
    const instructionsForTeachersMarkdown = turndown.turndown(
      task.providerData.instructionsForTeachers ?? ''
    );
    const submissionDescriptionMarkdown = turndown.turndown(
      task.providerData.submission?.description ?? ''
    );

    // HANDLE DATA
    const program = programs.find((item) => item.id === task.program);
    const center = getCenter(centers, task, program); // Sometimes it's not present in providerData

    const bulkId = `task${(index + 1).toString().padStart(2, '0')}`;
    const creator = adminShouldOwnAllAssets ? 'admin' : getCreator(task, users);

    const taskObject = {
      root: bulkId,
      name: task.name,
      tagline: task.tagline,
      description: task.description,
      tags: task.tags?.join(', '),
      color: task.color,
      cover: task.cover,
      creator,
      program: program?.bulkId || '',
      center,
      duration: task.providerData.duration,
      resources: resourcesString,
      statement: statementMarkdown,
      development,
      gradable: booleanToYesNoAnswer(task.providerData.gradable),
      submission_type: task.providerData.submission?.type,
      submission_extensions: Object.keys(task.providerData.submission?.data?.extensions ?? {}).join(
        ', '
      ),
      submission_max_size: task.providerData.submission?.data?.maxSize,
      submission_multiple_files: booleanToYesNoAnswer(
        task.providerData.submission?.data?.multipleFiles
      ),
      submission_description: submissionDescriptionMarkdown,
      instructions_for_teachers: instructionsForTeachersMarkdown,
      instructions_for_students: instructionsForStudentsMarkdown,
      metadata: getMetadataString(task, libraryAssets, notIndexableAssets),
      hideInLibrary: booleanToYesNoAnswer(!!task.hideInLibrary),
    };

    worksheet.addRow(_.omitBy(taskObject, _.isNil));

    return {
      ...task,
      bulkId,
    };
  });
}

module.exports = { createTasksSheet };
