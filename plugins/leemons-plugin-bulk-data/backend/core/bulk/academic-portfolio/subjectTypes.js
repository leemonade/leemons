const { keys, isNil, isEmpty } = require('lodash');
const itemsImport = require('../helpers/simpleListImport');

async function importAcademicPortfolioSubjectTypes(filePath, programs) {
  const items = await itemsImport(filePath, 'ap_subject_types', 20);

  keys(items)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
      const programKey = items[key].program;
      items[key].program = programs[programKey]?.id;
    });

  // console.dir(items, { depth: null });
  return items;
}

// ·····················································
// TESTING
/*
const PROGRAMS = {
  programA: { id: 'PA' },
  programB: { id: 'PB' },
};

importAcademicPortfolioSubjectTypes(PROGRAMS);
*/
module.exports = importAcademicPortfolioSubjectTypes;
