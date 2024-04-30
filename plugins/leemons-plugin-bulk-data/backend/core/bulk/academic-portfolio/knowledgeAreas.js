const { keys, isNil, isEmpty } = require('lodash');
const itemsImport = require('../helpers/simpleListImport');

async function importAcademicPortfolioKnowledgeAreas(filePath, centers) {
  const items = await itemsImport(filePath, 'ap_knowledgeAreas', 20);

  keys(items)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
      const centerKey = items[key].center;
      items[key].center = centers[centerKey]?.id;
    });

  return items;
}

module.exports = importAcademicPortfolioKnowledgeAreas;
