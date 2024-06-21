const _ = require('lodash');
const { styleCell } = require('./helpers');

const getCanAccess = (asset, users) => {
  const { fromUser } = asset;
  const ownerUser = users.find((u) => u.id === fromUser);
  const owner = `${ownerUser.bulkId}|owner`;

  return `${owner}`;
};

async function createNonIndexableLibraryAssetsSheet({
  workbook,
  programs,
  subjects,
  adminShouldOwnAllAssets,
  nonIndexableAssets,
  users,
  ctx,
}) {
  const worksheet = workbook.addWorksheet('non_indexable_assets');
  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'categoryKey', key: 'categoryKey', width: 15 },
    { header: 'name', key: 'name', width: 30 },
    { header: 'url', key: 'url', width: 30 },
    { header: 'file', key: 'file', width: 30 },
    { header: 'description', key: 'description', width: 30 },
    { header: 'color', key: 'color', width: 10 },
    { header: 'cover', key: 'cover', width: 30 },
    { header: 'tags', key: 'tags', width: 30 },
    { header: 'canAccess', key: 'canAccess', width: 30 },
    { header: 'program', key: 'program', width: 15 },
    { header: 'subjects', key: 'subjects', width: 15 },
  ];
  worksheet.addRow({
    root: 'BulkId',
    categoryKey: 'Category Key',
    name: 'Name',
    url: 'URL',
    file: 'File',
    description: 'Description',
    color: 'Color',
    cover: 'Cover',
    tags: 'Tags',
    canAccess: 'Can Access',
    program: 'Program',
    subjects: 'Subjects',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  const assetDetails = await ctx.call('leebrary.assets.getByIds', {
    ids: nonIndexableAssets.map((item) => item.asset.id),
    shouldPrepareAssets: true,
    withFiles: true,
  });

  assetDetails.forEach((asset) => {
    const { bulkId } = nonIndexableAssets.find((item) => item.asset.id === asset.id);
    const { categoryKey } = nonIndexableAssets.find((item) => item.asset.id === asset.id);

    const programBulkId = programs.find((p) => p.id === asset.program)?.bulkId;
    const subjectBulkIds = subjects
      .filter((s) => (asset.subjects || []).includes(s.id))
      ?.map((s) => s.bulkId);

    const file = categoryKey === 'media-files' ? asset.url : '';
    const canAccess = adminShouldOwnAllAssets ? 'admin|owner' : getCanAccess(asset, users);

    const assetObject = {
      root: bulkId,
      categoryKey,
      name: asset.name,
      url: categoryKey === 'bookmarks' ? asset.url : '',
      file,
      description: asset.description,
      color: asset.color,
      cover: asset.cover,
      tags: asset.tags.join(', '),
      canAccess,
      program: programBulkId,
    };

    if (subjectBulkIds.length) {
      assetObject.subjects = subjectBulkIds.join(', ');
    }

    worksheet.addRow(_.omitBy(assetObject, _.isNil));
  });
}

module.exports = { createNonIndexableLibraryAssetsSheet };
