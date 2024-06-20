const { styleCell } = require('./helpers');

async function createLocalesSheet({ workbook, ctx }) {
  const locales = await ctx.call('users.platform.getLocales');
  const worksheet = workbook.addWorksheet('locales');

  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'name', key: 'name', width: 20 },
    { header: 'code', key: 'code', width: 10 },
  ];

  // Headers row
  worksheet.addRow({ root: 'BulkId', name: 'Name', code: 'Code' });

  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  locales.forEach((locale) => {
    worksheet.addRow({ root: locale.code, name: locale.name, code: locale.code });
  });
}

module.exports = { createLocalesSheet };
