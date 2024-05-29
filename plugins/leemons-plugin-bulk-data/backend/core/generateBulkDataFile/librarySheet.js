const _ = require('lodash');
const { booleanToYesNoAnswer, styleCell } = require('./helpers');

const getCanAccess = (asset, users) => {
  const { fromUser } = asset;
  const ownerUser = users.find((u) => u.id === fromUser);
  const owner = `${ownerUser.bulkId}|owner`;

  return `${owner}`;
};

async function createLibraryResourcesSheet({
  workbook,
  programs,
  subjects,
  adminShouldOwnAllAssets,
  resourceAssets,
  users,
  ctx,
}) {
  const worksheet = workbook.addWorksheet('library');
  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'pinned', key: 'pinned', width: 10 },
    { header: 'categoryKey', key: 'categoryKey', width: 15 },
    { header: 'name', key: 'name', width: 30 },
    { header: 'url', key: 'url', width: 30 },
    { header: 'file', key: 'file', width: 30 },
    { header: 'tagline', key: 'tagline', width: 30 },
    { header: 'description', key: 'description', width: 30 },
    { header: 'color', key: 'color', width: 10 },
    { header: 'cover', key: 'cover', width: 30 },
    { header: 'tags', key: 'tags', width: 30 },
    { header: 'canAccess', key: 'canAccess', width: 30 },
    { header: 'program', key: 'program', width: 15 },
    { header: 'subject', key: 'subject', width: 15 },
    { header: 'enabled', key: 'enabled', width: 30 },
  ];
  worksheet.addRow({
    root: 'BulkId',
    pinned: 'Pinned',
    categoryKey: 'Category Key',
    name: 'Name',
    url: 'URL',
    file: 'File',
    tagline: 'Tagline',
    description: 'Description',
    color: 'Color',
    cover: 'Cover',
    tags: 'Tags',
    canAccess: 'Can Access',
    program: 'Program',
    subject: 'Subject',
    enabled: 'Enabled',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  const assetDetails = await ctx.call('leebrary.assets.getByIds', {
    ids: resourceAssets.map((a) => a.id),
    shouldPrepareAssets: true,
    withFiles: true,
    signedURLExpirationTime: 7 * 24 * 60 * 60, // 7 days
  });

  const assetsToReturn = [];
  assetDetails.forEach((asset, i) => {
    const bulkId = `L${(i + 1).toString().padStart(3, '0')}`;
    const programBulkId = programs.find((p) => p.id === asset.program)?.bulkId;
    // Previous bulk-data implementation assumes only one subject will be related to the resource. This needs to be updated, the first one is chosen here.
    const subjectBulkId = subjects.find((s) => s.id === asset.subjects?.[0]?.subject)?.bulkId;
    const categoryKey = resourceAssets.find((raw) => raw.id === asset.id).category.key;
    const file = categoryKey === 'media-files' ? asset.url : '';
    const canAccess = adminShouldOwnAllAssets ? 'admin|owner' : getCanAccess(asset, users);

    const assetObject = {
      root: bulkId,
      pinned: booleanToYesNoAnswer(asset.pinned),
      categoryKey,
      name: asset.name,
      url: categoryKey === 'bookmarks' ? asset.url : '',
      file,
      tagline: asset.tagline,
      description: asset.description,
      color: asset.color,
      cover: asset.cover,
      tags: asset.tags.join(', '),
      canAccess,
      program: programBulkId,
      subject: subjectBulkId,
      enabled: 'Yes',
    };

    worksheet.addRow(_.omitBy(assetObject, _.isNil));
    assetsToReturn.push({ id: asset.id, bulkId, asset: { ...asset } });
  });
  return assetsToReturn;
}

module.exports = { createLibraryResourcesSheet };
