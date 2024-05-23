const { camelCase } = require('lodash');
const { configureSheetColumns, styleCell, booleanToYesNoAnswer } = require('../helpers');
const {
  PROFILES_COLUMN_DEFINITIONS,
  computeHeaderValues,
  SIMPLE_COLUMN_DEFINITIONS,
  PLUGIN_COLUMN_DEFINITIONS,
} = require('./columnDefinitions');

// HELPERS ···································································································|

const addExtraGroupping = (worksheet) => {
  const offset = Object.keys(SIMPLE_COLUMN_DEFINITIONS).length;
  const groupLength = Object.keys(PLUGIN_COLUMN_DEFINITIONS).length;

  const startColumn = 1 + offset;
  const endColumn = startColumn + groupLength - 1;
  worksheet.mergeCells(2, startColumn, 2, endColumn);

  const mergedCell = worksheet.getCell(2, startColumn);
  mergedCell.value = 'Plugin Permissions';
  styleCell({
    cell: mergedCell,
    fontColor: 'white',
    bgColor: 'black',
    alignment: { horizontal: 'center', vertical: 'middle' },
  });
};

async function getPermissionsPerPlugin({ ctx, profileUri }) {
  const {
    profile: { permissions },
  } = await ctx.call('users.profiles.detailRest', { uri: profileUri });

  const results = {};
  Object.keys(permissions).forEach((permissionKey) => {
    const permission = permissions[permissionKey]?.join(', ') || '';
    const [plugin, ...entity] = permissionKey.split('.');
    results[camelCase(`${plugin} ${entity.join(' ')}`)] = permission;
  });
  return results;
}

// MAIN FUNCTION ···········································································|

async function createProfilesSheet({ workbook, ctx }) {
  const worksheet = workbook.addWorksheet('profiles');
  configureSheetColumns({
    worksheet,
    columnDefinitions: PROFILES_COLUMN_DEFINITIONS,
    offset: 1,
    withGroupedTitles: true,
    addTitleKeysRow: true,
    addGroupTitleKeysRow: true,
    modifyColumnHeaders: computeHeaderValues,
  });
  addExtraGroupping(worksheet);

  const { items: profilesData } = await ctx.call('users.profiles.list', {
    indexable: 'all',
    page: 0,
    size: 9999,
  });

  profilesData.forEach(async (profile) => {
    const permissionsPerPlugin = await getPermissionsPerPlugin({ ctx, profileUri: profile.uri });

    // To implement later, get the profile.sysName that corresponds to the profile found and set it to basicInfo.accessTo
    // const profileContacts = await ctx.call('users.profiles.getProfileContacts', {
    //   fromProfile: profile.id,
    // });

    const basicInfo = {
      root: profile.sysName,
      name: profile.name,
      description: profile.description,
      indexable: booleanToYesNoAnswer(profile.indexable),
      // accessTo: profilesData
      //   .filter((_profile) => profileContacts.includes(_profile.id))
      //   .map((_profile) => _profile.sysName)
      //   .join(', '),
    };

    worksheet.addRow({ ...basicInfo, ...permissionsPerPlugin });
  });
}

module.exports = {
  createProfilesSheet,
};
