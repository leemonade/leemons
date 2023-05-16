const { range, keys, findIndex, trim, isEmpty, isNil, toLower } = require('lodash');
const getColumns = require('./helpers/getColumns');
const DataImporter = require('./helpers/getXlsImporter')();

const factory = new DataImporter();

async function importProfiles(filePath) {
  const importer = await factory.from(filePath);
  const config = {
    profiles: {
      worksheet: 'profiles',
      type: 'list',
      columns: getColumns(100),
    },
  };

  const profiles = importer.getAllItems(config.profiles);

  // ·····················································
  // HEADER FIELDS

  const fields = keys(profiles[0])
    .map((key) => profiles[0][key])
    .filter((key) => !isNil(key) && !isEmpty(key));

  // ·····················································
  // PROFILE FIELDS START COLUMN INDEX

  const fieldStartColumnOffset = 1; // first column is omitted
  const fieldStartColumn =
    findIndex(fields, (field) => field.indexOf('root') > -1) + fieldStartColumnOffset;
  const fieldStopColumn = findIndex(fields, (field) => field.indexOf('access') > -1);

  // ·····················································
  // PROFILE PERMISSION START COLUMN INDEX

  const accessToColumn = fieldStopColumn + 1;

  // ·····················································
  // PROFILE PERMISSION START COLUMN INDEX

  const permissionStartColumn = findIndex(fields, (field) => field.indexOf('plugins') > -1);

  // ·····················································
  // PROFILE ITEMS START ROW INDEX

  const itemsStartRowOffset = 2; // fields names and header items
  const itemsStartRow =
    findIndex(profiles.slice(1), (profile) => profile[1] !== '') + itemsStartRowOffset;

  const items = profiles
    .slice(itemsStartRow)
    .map((profile) => {
      const item = { root: profile[1], permissions: [] };

      // Add profile fields
      range(fieldStartColumn, fieldStopColumn).forEach((index) => {
        item[fields[index]] = profile[fieldStartColumn + index];
      });

      item.indexable = toLower(String(item.indexable)) === 'yes' || Number(item.indexable) === 1;

      // Profile can accessTo
      item.accessTo = profile[accessToColumn]
        ?.split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val));

      // Add permissions fields
      range(permissionStartColumn, fields.length).forEach((index) => {
        const actionNames = profile[fieldStartColumn + index]
          .split(',')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val));

        item.permissions.push({
          permissionName: fields[index],
          actionNames,
        });
      });

      item.permissions = item.permissions.filter((permission) => !isEmpty(permission.actionNames));
      return item;
    })
    .reduce((acc, item) => {
      const { root, ...rest } = item;
      acc[root] = rest;
      return acc;
    }, {});

  // console.dir(items, { depth: null });
  return items;
}

// ·····················································
// TESTING

// importProfiles();

module.exports = importProfiles;
