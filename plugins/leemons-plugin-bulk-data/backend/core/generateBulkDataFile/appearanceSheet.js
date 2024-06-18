const { styleCell, booleanToYesNoAnswer } = require('./helpers');
const { PLATFORM_NAME } = require('./config/constants');

async function createAppearanceSheet({ workbook, ctx }) {
  const worksheet = workbook.addWorksheet('appearance');

  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'logoUrl', key: 'logoUrl', width: 30 },
    { header: 'squareLogoUrl', key: 'squareLogoUrl', width: 30 },
    { header: 'emailLogoUrl', key: 'emailLogoUrl', width: 30 },
    { header: 'emailWidthLogo', key: 'emailWidthLogo', width: 20 },
    { header: 'mainColor', key: 'mainColor', width: 20 },
    { header: 'useDarkMode', key: 'useDarkMode', width: 15 },
    { header: 'menuMainColor', key: 'menuMainColor', width: 20 },
    { header: 'menuDrawerColor', key: 'menuDrawerColor', width: 20 },
    { header: 'usePicturesEmptyStates', key: 'usePicturesEmptyStates', width: 25 },
  ];

  // Headers row
  worksheet.addRow({
    root: 'BulkId',
    logoUrl: 'Logo Url',
    squareLogoUrl: 'Square Logo Url',
    emailLogoUrl: 'Email Logo Url',
    emailWidthLogo: 'Email Logo Width',
    mainColor: 'Main Color',
    useDarkMode: 'Dark Mode',
    menuMainColor: 'Menu Main Color',
    menuDrawerColor: 'Menu Drawer Color',
    usePicturesEmptyStates: 'Use Pictures Empty States',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  const { organization } = await ctx.call('admin.organization.get');

  worksheet.addRow({
    root: PLATFORM_NAME,
    emailWidthLogo: organization.emailWidthLogo ?? '200',
    logoUrl: organization.logoUrl,
    squareLogoUrl: organization.squareLogoUrl,
    emailLogoUrl: organization.emailLogoUrl,
    mainColor: organization.mainColor ?? '#40aebf',
    useDarkMode: booleanToYesNoAnswer(organization?.useDarkMode) ?? 'No',
    menuMainColor: organization.menuMainColor ?? '#193E3A',
    menuDrawerColor: organization.menuDrawerColor ?? '#193E3A',
    usePicturesEmptyStates: booleanToYesNoAnswer(organization?.usePicturesEmptyStates) ?? 'No',
  });
}

module.exports = {
  createAppearanceSheet,
};
