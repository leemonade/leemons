const { keys, trim, isEmpty, isNil, toLower } = require('lodash');
const itemsImport = require('./helpers/simpleListImport');

async function importFamilies(filePath, users) {
  const items = await itemsImport(filePath, 'families', 20, false);

  keys(items)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
      const family = items[key];

      family.relations = family.relations
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((relation) => {
          const [guardianData, student] = relation.split('@');
          const [guardian, relationship] = guardianData.split('|');
          return {
            guardian: { name: users[guardian]?.name, userAgents: users[guardian]?.userAgents },
            student: { name: users[student]?.name, userAgents: users[student]?.userAgents },
            relationship,
          };
        });

      family.maritalStatus = `plugins.families.detail_page.maritalStatus.${toLower(
        family.maritalStatus
      ).replace(/ /g, '_')}`;

      family.emergencyPhoneNumbers = family.emergencyPhoneNumbers
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((phoneNumber) => {
          const [phone, contactData] = phoneNumber.split('@');
          const [name, relation] = contactData.split('|');
          return { name, phone, relation };
        });

      items[key] = family;
    });

  // console.dir(items, { depth: null });
  return items;
}

// ·····················································
// TESTING
/*
const USERS = {
  guardian01: { id: 'G01' },
  studentA02: { id: 'SA02' },
  studentB02: { id: 'SB02' },
};

importFamilies(USERS);
*/
module.exports = importFamilies;
