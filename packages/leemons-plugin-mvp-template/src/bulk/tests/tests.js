const path = require('path');
const { keys, trim, isEmpty } = require('lodash');
const itemsImport = require('../helpers/simpleListImport');

async function importTests({ programs, qbanks }) {
  const filePath = path.resolve(__dirname, '../data.xlsx');
  const items = await itemsImport(filePath, 'te_tests', 40, true, true);

  keys(items).forEach((key) => {
    const test = items[key];

    // Qbank program
    const program = programs[qbank.program];

    qbank.program = program.id;
    qbank.subjects = (qbank.subjects || '')
      ?.split(',')
      .map((val) => trim(val))
      .filter((val) => !isEmpty(val))
      .map((subject) => program.subjects[subject]?.id);

    // Tags
    qbank.tags = (qbank.tags || '')
      ?.split(',')
      .map((val) => trim(val))
      .filter((val) => !isEmpty(val));

    items[key] = qbank;
  });

  // console.dir(items, { depth: null });
  return items;
}

// ·····················································
// TESTING

// importQbanks();

module.exports = importQbanks;
