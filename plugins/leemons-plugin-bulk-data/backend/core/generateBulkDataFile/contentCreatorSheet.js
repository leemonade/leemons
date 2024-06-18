const { isEmpty } = require('lodash');

const {
  styleCell,
  booleanToYesNoAnswer,
  getDuplicatedAssetsReferenceAsString,
  handleNonIndexableAssetsNeeded,
  solveCoverImage,
} = require('./helpers');

const getCreator = (asset, users) => users.find((u) => u.id === asset.fromUser)?.bulkId;

// function processLibraryTag({
//   htmlContent,
//   libraryAssets,
//   embededAssets,
//   nonIndexableAssetsNeeded,
// }) {
//   if (isEmpty(htmlContent)) return '';
//   const regex = /<library [^>]*id="([^"]+?@\d+\.\d+\.\d+)"[^>]*>.*?<\/library>/g;
//   return htmlContent.replace(regex, (match, id) => {
//     const asset = embededAssets.find((embededAsset) => embededAsset.id === id);
//     let assetReference = getDuplicatedAssetsReferenceAsString(libraryAssets, [asset]);
//     if (assetReference) {
//       return `<library bulkId="${assetReference}"></library>`;
//     }
//     assetReference = handleNonIndexableAssetsNeeded(nonIndexableAssetsNeeded, asset);
//     return `<library bulkId="${assetReference}"></library>`;
//   });
// }

function processLibraryTag({
  htmlContent,
  libraryAssets,
  embededAssets,
  nonIndexableAssetsNeeded,
}) {
  if (isEmpty(htmlContent)) return '';
  const regex = /<library ([^>]*?)id="([^"]+?@\d+\.\d+\.\d+)"([^>]*?)>.*?<\/library>/g;
  return htmlContent.replace(regex, (match, preIdAttributes, id, postIdAttributes) => {
    const asset = embededAssets.find((embededAsset) => embededAsset.id === id);
    let assetReference = getDuplicatedAssetsReferenceAsString(libraryAssets, [asset]);
    if (!assetReference) {
      assetReference = handleNonIndexableAssetsNeeded(nonIndexableAssetsNeeded, asset);
    }
    return `<library ${preIdAttributes}bulkId="${assetReference}"${postIdAttributes}></library>`;
  });
}

function getEmbededAssetsFromHTML(htmlArray) {
  if (isEmpty(htmlArray)) return [];
  const regex = /<library [^>]*id="([^"]+?@\d+\.\d+\.\d+)"[^>]*>/g;
  return htmlArray.flatMap((html) => {
    const matches = [...html.matchAll(regex)];
    return matches.map((match) => match[1]);
  });
}

async function createContentCreatorSheet({
  workbook,
  documents,
  libraryAssets,
  users,
  programs,
  adminShouldOwnAllAssets,
  nonIndexableAssetsNeeded,
  subjects,
  ctx,
}) {
  const worksheet = workbook.addWorksheet('content_creator');

  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'name', key: 'name', width: 20 },
    { header: 'description', key: 'description', width: 20 },
    { header: 'color', key: 'color', width: 20 },
    { header: 'cover', key: 'cover', width: 20 },
    { header: 'tags', key: 'tags', width: 20 },
    { header: 'creator', key: 'creator', width: 20 },
    { header: 'program', key: 'program', width: 20 },
    { header: 'subjects', key: 'subjects', width: 20 },
    { header: 'published', key: 'published', width: 20 },
    { header: 'htmlContent', key: 'htmlContent', width: 20 },
  ];

  // Headers row
  worksheet.addRow({
    root: 'BulkId',
    name: 'Name',
    description: 'Description',
    color: 'Color',
    cover: 'Cover',
    tags: 'Tags',
    creator: 'Creator',
    program: 'Program',
    subjects: 'Subjects',
    published: 'Published',
    htmlContent: 'HTML Content',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  const versionControlledDocuments = await ctx.call('leebrary.assets.filterByVersionOfType', {
    assetIds: documents.map((a) => a.id),
    categoryId: documents?.[0]?.category?.id,
  });

  const documentDetails = await ctx.call('leebrary.assets.getByIds', {
    ids: versionControlledDocuments,
    shouldPrepareAssets: true,
    withFiles: true,
  });

  const { document: assignableDetails } = await ctx.call(
    'content-creator.document.getDocumentRest',
    {
      id: documentDetails.map((doc) => doc.providerData.id),
    }
  );

  const embededAssetIds = getEmbededAssetsFromHTML(assignableDetails.map((item) => item.content));
  const filteredEmbededAssetIds = embededAssetIds.filter(
    (id) => !libraryAssets.map((item) => item.id).includes(id)
  );
  const embededAssetDetails = await ctx.call('leebrary.assets.getByIds', {
    ids: filteredEmbededAssetIds,
    shouldPrepareAssets: true,
    withFiles: true,
  });

  return documentDetails.map((document, i) => {
    const assignable = assignableDetails.find((item) => item.id === document.providerData.id);
    let subjectsArray = document.subjects?.length
      ? document.subjects.map((item) => item.subject)
      : null;
    if (!subjectsArray)
      subjectsArray = document.providerData.subjects?.length
        ? document.providerData.subjects.map((item) => item.subject)
        : [];

    const htmlContentProcessed = processLibraryTag({
      htmlContent: assignable.content,
      libraryAssets,
      embededAssets: embededAssetDetails,
      nonIndexableAssetsNeeded,
    });
    let _program = document.program;
    if (!_program) _program = document.providerData.program;

    const bulkId = `ccreator_${(i + 1).toString().padStart(2, '0')}`;
    const creator = adminShouldOwnAllAssets ? 'admin' : getCreator(document, users);
    const cover = solveCoverImage({
      processedItem: document,
      coverFileId: documents
        .filter((doc) => versionControlledDocuments.includes(doc.id))
        .find(({ id }) => id === document.id)?.cover,
      libraryAssets,
    });

    const documentObject = {
      root: bulkId,
      name: document.name,
      description: document.description,
      color: document.color,
      cover,
      tags: document.tags?.join(', '),
      creator,
      htmlContent: htmlContentProcessed,
      program: programs.find((item) => item.id === _program)?.bulkId,
      subjects: subjects
        .filter((item) => subjectsArray.includes(item.id))
        ?.map((item) => item.bulkId)
        .join(', '),
      published: booleanToYesNoAnswer(document.providerData.published),
    };
    worksheet.addRow(documentObject);

    return {
      ...document,
      bulkId,
    };
  });
}

module.exports = { createContentCreatorSheet };
