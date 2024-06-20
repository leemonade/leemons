const { styleCell } = require('./helpers');

async function createAcademicPortfolioProfilesSheet({ workbook, ctx }) {
  const worksheet = workbook.addWorksheet('ap_profiles');

  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'profile', key: 'profile', width: 20 },
  ];

  // Headers row
  worksheet.addRow({ root: 'BulkId', profile: 'System Profile' });

  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  const apProfiles = await ctx.call('academic-portfolio.settings.getProfiles');
  Object.keys(apProfiles).forEach((sysname) => {
    worksheet.addRow({ root: sysname, profile: sysname });
  });
}

module.exports = { createAcademicPortfolioProfilesSheet };
