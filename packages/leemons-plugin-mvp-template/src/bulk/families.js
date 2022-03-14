const path = require('path');
const { keys, trim, isEmpty } = require('lodash');
const itemsImport = require('./helpers/simpleListImport');

async function importFamilies(users) {
  const filePath = path.resolve(__dirname, 'data.xlsx');
  const items = await itemsImport(filePath, 'families', 10);

  keys(items).forEach((key) => {
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
