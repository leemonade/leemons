const { keys, isNil, isEmpty } = require('lodash');
const itemsImport = require('../helpers/simpleListImport');

async function importAcademicPortfolioProfiles(filePath, profiles) {
  const items = await itemsImport(filePath, 'ap_profiles', 5);

  /*
  We want items to be transformed from this:
  {"guardian":{"profile":"guardian"},"student":{"profile":"student"}}

  into this:
  {"guardian":"G","student":"S"}
  */

  keys(items)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
      const subKey = keys(items[key])[0];
      items[key] = profiles[items[key][subKey]]?.id;
    });

  // console.dir(items, { depth: null });
  return items;
}

// ·····················································
// TESTING
/*
const PROFILES = {
  admin: { id: 'A' },
  teacher: { id: 'T' },
  student: { id: 'S' },
  guardian: { id: 'G' },
};

importAcademicPortfolioProfiles(PROFILES);
*/

module.exports = importAcademicPortfolioProfiles;
