const { styleCell } = require('./helpers');

async function createCentersSheet({ workbook, ctx }) {
  const worksheet = workbook.addWorksheet('centers');

  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'name', key: 'name', width: 20 },
    { header: 'description', key: 'description', width: 20 },
    { header: 'locale', key: 'locale', width: 20 },
    { header: 'email', key: 'email', width: 20 },
  ];

  // Headers row
  worksheet.addRow({
    root: 'BulkId',
    name: 'Name',
    description: 'Description',
    locale: 'Locale',
    email: 'Email',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  // Get and set centers data
  const centersData = await ctx.call('users.centers.list', {
    page: 0,
    size: 9999,
  });

  const centers = [];
  let wrapCount = 0;
  centersData?.items.forEach((center, i) => {
    if (i > 0 && i % 26 === 0) wrapCount++;
    const suffix = wrapCount > 0 ? wrapCount : '';
    const bulkId = `center${String.fromCharCode(65 + (i % 26))}${suffix}`;
    worksheet.addRow({
      root: bulkId,
      name: center.name,
      description: center.description ?? '',
      locale: center.locale,
      email: center.email,
    });
    centers.push({ id: center.id, bulkId });
  });

  return centers;
}

module.exports = {
  createCentersSheet,
};
