async function createLibraryResourcesSheet({ workbook, ctx }) {
  const worksheet = workbook.addWorksheet('library');
  worksheet.columns = [
    { header: 'root', key: 'root', width: 30 },
    { header: 'pinned', key: 'pinned', width: 30 },
    { header: 'categoryKey', key: 'categoryKey', width: 30 },
    { header: 'name', key: 'name', width: 30 },
    { header: 'url', key: 'url', width: 30 },
    { header: 'file', key: 'file', width: 30 },
    { header: 'tagline', key: 'tagline', width: 30 },
    { header: 'description', key: 'description', width: 30 },
    { header: 'color', key: 'color', width: 30 },
    { header: 'cover', key: 'cover', width: 30 },
    { header: 'tags', key: 'tags', width: 30 },
    { header: 'canAccess', key: 'canAccess', width: 30 },
    { header: 'program', key: 'program', width: 30 },
    { header: 'subject', key: 'subject', width: 30 },
    { header: 'enabled', key: 'enabled', width: 30 },
  ];
  worksheet.headers = {
    root: 'Root',
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
  };

  const allAssets = await ctx.call('leebrary.assets.getAllAssets', {
    indexable: true,
    checkPermissions: true,
    withFiles: true,
  });
  // get category name with id
  // we need programs dictionary to set the program bulkId
  // we need subjects dictionary to set the subject bulkId
}

module.exports = { createLibraryResourcesSheet };
