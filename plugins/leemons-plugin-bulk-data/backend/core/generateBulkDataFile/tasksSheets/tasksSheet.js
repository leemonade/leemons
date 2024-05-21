const _ = require('lodash');
const TurndownService = require('turndown');

const { configureSheetColumns, booleanToYesNoAnswer } = require('../helpers');
const { TASK_COLUMN_DEFINITIONS } = require('./columnDefinitions');

const turndown = new TurndownService();

// HELPER FUNCTIONS ·······················································································|

// When creating a task and using existing library assets as resources, these resources get duplicated.
// This will happen again while loading the generated bulk data file, so in order to not have duplicated duplications
// Only indexed assets are return as libraryAssets. For this function we need to find the asset that matches, the one that will be duplicated as a resource of the task
function getResourcesString(libraryResources, taskResources) {
  const keysToCompare = [
    'name',
    'fromUser',
    'fromUserAgent',
    'fileExtension',
    'fileType',
    'category',
    'description',
    'program',
    'color',
    'file.name',
    'file.extension',
    'file.metadata',
  ];

  const libraryResourcesMatching = taskResources
    .map((taskResource) =>
      libraryResources.find((libraryResource) =>
        keysToCompare.every((key) => _.get(taskResource, key) === _.get(libraryResource.asset, key))
      )
    )
    .filter((matchedItem) => matchedItem !== undefined);

  return libraryResourcesMatching.map((item) => item.bulkId).join('|');
}

const getCenter = (centers, task, taskProgram) => {
  if (task.providerData.center) {
    centers.find((item) => item.id === task.providerData.center);
  }
  return taskProgram.centerBulkId;
};

const getCreator = (taskAsset, users) => users.find((u) => u.id === taskAsset.fromUser)?.bulkId;

// MAIN FUNCTION ······································································|

async function createTasksSheet({ workbook, libraryAssets, tasks, programs, centers, users, ctx }) {
  const worksheet = workbook.addWorksheet('ta_tasks');
  configureSheetColumns({ worksheet, columnDefinitions: TASK_COLUMN_DEFINITIONS });

  const taskDetails = await ctx.call('leebrary.assets.getByIds', {
    ids: tasks.map((a) => a.id),
    shouldPrepareAssets: true,
    withFiles: true,
  });

  const allResourceAssetIds = taskDetails.flatMap((task) => task.providerData?.resources ?? []);
  const allResourceAssetsDetails = await ctx.call('leebrary.assets.getByIds', {
    ids: allResourceAssetIds,
    shouldPrepareAssets: true,
    withFiles: true,
  });

  return taskDetails.map((task, index) => {
    // TASK RESOURCES
    const taskAssets = task.providerData.resources.map((id) =>
      allResourceAssetsDetails.find((asset) => asset.id === id)
    );
    const resourcesString = getResourcesString(libraryAssets, taskAssets);

    // HANDLE HTML TO MARKDOWN
    const developmentMarkdown = turndown.turndown(
      task.providerData.metadata?.development?.[0]?.development ?? ''
    );
    const statementMarkdown = turndown.turndown(task.providerData.statement);
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

    const taskObject = {
      root: bulkId,
      name: task.name,
      tagline: task.tagline,
      description: task.description,
      tags: task.tags?.join(', '),
      color: task.color,
      cover: task.cover,
      creator: getCreator(task, users),
      program: program.bulkId,
      center,
      duration: task.providerData.duration,
      resources: resourcesString,
      statement: statementMarkdown,
      development: developmentMarkdown,
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
    };

    worksheet.addRow(_.omitBy(taskObject, _.isNil));

    return {
      ...task,
      bulkId,
    };
  });
}

module.exports = { createTasksSheet };
