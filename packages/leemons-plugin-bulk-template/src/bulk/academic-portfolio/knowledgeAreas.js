const { keys } = require('lodash');
const path = require('path');
const itemsImport = require('../helpers/simpleListImport');

async function importAcademicPortfolioKnowledgeAreas(programs) {
  const filePath = path.resolve(__dirname, '../data.xlsx');
  const items = await itemsImport(filePath, 'ap_knowledges', 20);

  keys(items).forEach((key) => {
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

importAcademicPortfolioKnowledgeAreas(PROGRAMS);
*/
module.exports = importAcademicPortfolioKnowledgeAreas;
