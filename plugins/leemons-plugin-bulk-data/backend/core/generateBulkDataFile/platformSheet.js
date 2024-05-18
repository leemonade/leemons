const { styleCell } = require('./helpers');
const { PLATFORM_NAME } = require('./config/constants');

async function createPlatformSheet({ workbook, ctx }) {
  const worksheet = workbook.addWorksheet('platform');

  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'name', key: 'name', width: 20 },
    { header: 'email', key: 'email', width: 20 },
    { header: 'locale', key: 'locale', width: 10 },
    { header: 'hostname', key: 'hostname', width: 20 },
  ];

  // Headers row
  worksheet.addRow({
    root: 'BulkId',
    name: 'Name',
    email: 'Email',
    locale: 'Locale',
    hostname: 'Hostname',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  // Get and set platform data
  const name = await ctx.call('users.platform.getName');
  const email = await ctx.call('users.platform.getEmail');
  const defaultLocale = await ctx.call('users.platform.getDefaultLocale');
  const hostname = await ctx.call('users.platform.getHostname');
  worksheet.addRow({
    root: PLATFORM_NAME,
    name: name ?? '-',
    email,
    locale: defaultLocale,
    hostname,
  });
}

module.exports = { createPlatformSheet };
