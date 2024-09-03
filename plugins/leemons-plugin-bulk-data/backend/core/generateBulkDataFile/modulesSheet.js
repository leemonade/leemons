const _ = require('lodash');
const {
  styleCell,
  booleanToYesNoAnswer,
  solveCoverImage,
  getDuplicatedAssetsReferenceAsString,
} = require('./helpers');

const getCreator = (taskAsset, users) => users.find((u) => u.id === taskAsset.fromUser)?.bulkId;

const getModuleSubmissionAssets = ({
  module,
  assignables,
  nonIndexableAssetsNeeded,
  assignableLibraryAssets = [],
  libraryAssets,
}) => {
  const { activities } = module.providerData.submission;
  let needsLibraryAssets = false;

  const references = [];
  activities.forEach(({ activity }) => {
    const assignableMatch = assignables.find(
      (assignable) => assignable.providerData.id === activity
    );
    if (assignableMatch) {
      references.push(assignableMatch.bulkId);
    } else {
      needsLibraryAssets = true;
    }
  });

  let libraryAssetReferences = '';
  if (needsLibraryAssets) {
    libraryAssetReferences = getDuplicatedAssetsReferenceAsString({
      libraryAssets,
      dups: assignableLibraryAssets,
      addNotFoundToNonIndexableAssets: true,
      nonIndexableAssets: nonIndexableAssetsNeeded,
      separator: ', ',
    });
  }
  const connector = libraryAssetReferences?.length && references.length ? ', ' : '';
  return `${references.join(', ')}${connector}${libraryAssetReferences}`;
};

const getModuleResources = ({
  moduleResources,
  libraryAssets,
  cCreatorDocuments,
  nonIndexableAssets,
  nonIndexableAssetsNeeded,
}) => {
  const documentResourceBulkIds = [];
  const libraryAssetResources = [];
  moduleResources.forEach((resource) => {
    const documentFound = cCreatorDocuments.find((documentAsset) => documentAsset.id === resource);
    if (documentFound) {
      documentResourceBulkIds.push(documentFound.bulkId); // Erased docs are not handled yet
      return;
    }
    const resourceFound = nonIndexableAssets.find((asset) => asset.id === resource);
    if (resourceFound) {
      libraryAssetResources.push(resourceFound);
    }
  });

  const libraryResources = getDuplicatedAssetsReferenceAsString({
    libraryAssets,
    dups: libraryAssetResources,
    addNotFoundToNonIndexableAssets: true,
    nonIndexableAssets,
    nonIndexableAssetsNeeded,
  });
  const connector = documentResourceBulkIds.length && libraryResources.length ? ',' : '';
  return `${documentResourceBulkIds.join(',')}${connector}${libraryResources}`;
};

async function createModulesSheet({
  workbook,
  moduleDetails,
  libraryAssets,
  nonIndexableAssetsNeeded,
  adminShouldOwnAllAssets,
  tests,
  tasks,
  cCreatorDocuments,
  programs,
  subjects,
  users,
  ctx,
}) {
  const worksheet = workbook.addWorksheet('lp_modules');
  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'name', key: 'name', width: 20 },
    { header: 'description', key: 'description', width: 20 },
    { header: 'tagline', key: 'tagline', width: 20 },
    { header: 'color', key: 'color', width: 20 },
    { header: 'cover', key: 'cover', width: 20 },
    { header: 'tags', key: 'tags', width: 20 },
    { header: 'creator', key: 'creator', width: 20 },
    { header: 'program', key: 'program', width: 20 },
    { header: 'subjects', key: 'subjects', width: 20 },
    { header: 'resources', key: 'resources', width: 20 },
    { header: 'submission', key: 'submission', width: 20 },
    { header: 'published', key: 'published', width: 20 },
  ];
  worksheet.addRow({
    root: 'BulkId',
    name: 'Name',
    description: 'Description',
    tagline: 'Tagline',
    color: 'Color',
    cover: 'Cover',
    tags: 'Tags',
    creator: 'Creator',
    program: 'Program',
    subjects: 'Subjects',
    resources: 'Resources',
    submission: 'Submission',
    published: 'Published',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  const assignables = [...tasks, ...tests, ...cCreatorDocuments];
  const { nonIndexableAssetIds, libraryAssetAssignableIds } = moduleDetails.reduce(
    (acc, module) => {
      if (!module.providerData) return acc;
      const {
        resources,
        submission: { activities },
      } = module.providerData;

      if (resources?.length) {
        resources.forEach((element) => {
          const resourceInLibraryAssets = libraryAssets.find((item) => item.id === element);
          if (!resourceInLibraryAssets) {
            acc.nonIndexableAssetIds.push(element);
          }
        });
      }

      if (activities?.length) {
        activities.forEach(({ activity }) => {
          const assignableMatch = assignables.find(
            (assignable) => assignable.providerData.id === activity
          );
          const libraryMatch = libraryAssets.find((item) => item.id === activity);
          if (!assignableMatch && !libraryMatch) {
            acc.libraryAssetAssignableIds.push(activity);
          }
        });
      }

      return acc;
    },
    { nonIndexableAssetIds: [], libraryAssetAssignableIds: [] }
  );

  let assignableLibraryAssets = [];
  if (libraryAssetAssignableIds.length) {
    const assignableLibraryAssetsFound = await ctx.call('assignables.assignables.getAssignables', {
      ids: libraryAssetAssignableIds,
      withFiles: true,
    });
    assignableLibraryAssets = assignableLibraryAssetsFound.filter(
      ({ role }) => role === 'leebrary.asset'
    ); // to avoid deleted activities which are not handled yet
  }

  let nonIndexableAssets = [];
  if (nonIndexableAssetIds.length) {
    nonIndexableAssets = await ctx.call('leebrary.assets.getByIds', {
      ids: [
        ...nonIndexableAssetIds,
        ...assignableLibraryAssets.map((assignable) => assignable.metadata.leebrary.asset),
      ],
      shouldPrepareAssets: true,
      withFiles: true,
    });
  }

  moduleDetails.forEach((module, i) => {
    // BASIC DATA
    const cover = solveCoverImage({
      processedItem: module,
      coverFileId: module.original.cover?.id,
      libraryAssets,
    });
    const bulkId = `lp_module${(i + 1).toString().padStart(2, '0')}`;
    const creator = adminShouldOwnAllAssets ? 'admin' : getCreator(module, users);

    // ACADEMIC DATA
    const subjectsArray = module.providerData.subjects?.length
      ? module.providerData.subjects.map((item) => item.subject)
      : [];
    const _program = module.program ?? module.providerData.program;

    // RESOURCES
    const resourcesString = getModuleResources({
      moduleResources: module.providerData.resources,
      libraryAssets,
      cCreatorDocuments,
      nonIndexableAssets,
      nonIndexableAssetsNeeded,
    });

    // SUBMISSIONS
    const moduleAssignableLibraryAssets = module.providerData.submission.activities
      .map(({ activity }) => {
        const assignableMatchAssetId = assignableLibraryAssets.find((item) => item.id === activity)
          ?.metadata.leebrary.asset;
        return nonIndexableAssets.find((item) => item.id === assignableMatchAssetId);
      })
      .filter(Boolean);
    const submissionString = getModuleSubmissionAssets({
      module,
      assignables,
      libraryAssets,
      assignableLibraryAssets: moduleAssignableLibraryAssets,
      nonIndexableAssetsNeeded,
    });

    const moduleObject = {
      root: bulkId,
      name: module.name,
      description: module.description,
      tagline: module.tagline,
      color: module.color,
      cover,
      tags: module.tags?.join(', '),
      resources: resourcesString,
      submission: submissionString,
      creator,
      program: programs.find((item) => item.id === _program)?.bulkId,
      subjects: subjects
        .filter((item) => subjectsArray.includes(item.id))
        ?.map((item) => item.bulkId)
        .join(', '),
      published: booleanToYesNoAnswer(module.providerData.published),
    };
    worksheet.addRow(_.omitBy(moduleObject, _.isNil));
  });
}

module.exports = { createModulesSheet };
