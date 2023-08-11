const { range, keys, findIndex, trim, isEmpty, isNil, toLower } = require('lodash');
const getColumns = require('./helpers/getColumns');
const DataImporter = require('./helpers/getXlsImporter')();

const factory = new DataImporter();

async function importUsers(filePath, centers, profiles) {
  const importer = await factory.from(filePath);
  const config = {
    data: {
      worksheet: 'users',
      type: 'list',
      columns: getColumns(20),
    },
  };

  const data = importer.getAllItems(config.data);

  // ·····················································
  // HEADER FIELDS

  const fields = keys(data[0])
    .map((key) => data[0][key])
    .filter((key) => !isNil(key) && !isEmpty(key));

  // ·····················································
  // ITEM FIELDS START COLUMN INDEX

  const fieldStartColumnOffset = 1; // first column is omitted
  const fieldStartColumn =
    findIndex(fields, (field) => field.indexOf('root') > -1) + fieldStartColumnOffset;

  // ·····················································
  // PROFILES START COLUMN INDEX

  const profilesColumn = findIndex(fields, (field) => field.indexOf('profiles') > -1);

  // ·····················································
  // ITEMS START ROW INDEX

  const itemsStartRowOffset = 2; // fields names and header items
  const itemsStartRow = findIndex(data.slice(1), (item) => item[1] !== '') + itemsStartRowOffset;

  const items = data
    .slice(itemsStartRow)
    .map((row) => {
      const item = { root: row[1], roles: [] };

      // Add user fields
      range(fieldStartColumn, profilesColumn).forEach((index) => {
        item[fields[index]] = row[fieldStartColumn + index];
      });

      // Add profiles fields
      item.roles = row[profilesColumn + 1]
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((val) => {
          const [profile, center] = val.split('@');
          return {
            profile: profiles[profile]?.id,
            center: centers[center]?.id,
            profileKey: profile,
            profileRole: profiles[profile]?.role,
          };
        });

      item.tags = item.tags
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val));

      item.gender = toLower(item.gender);

      if (!isEmpty(item.birthdate) && item.birthdate.indexOf('/') > 0) {
        const [day, month, year] = item.birthdate.split('/');
        item.birthdate = new Date(year, month - 1, day);
      }

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
/*
const CENTERS = {
  centerA: { id: 'A' },
  centerB: { id: 'B' },
};

const PROFILES = {
  admin: { id: 'A' },
  teacher: { id: 'T' },
  student: { id: 'S' },
  guardian: { id: 'G' },
};

importUsers(CENTERS, PROFILES);
*/

module.exports = importUsers;
