/* eslint-disable no-await-in-loop */
const { keys } = require('lodash');
const importGrades = require('./bulk/grades');

async function initGrades(file, centers) {
  const { services } = leemons.getPlugin('grades');

  try {
    const grades = await importGrades(file, centers);
    const itemsKeys = keys(grades);

    for (let i = 0, len = itemsKeys.length; i < len; i++) {
      const itemKey = itemsKeys[i];
      const item = grades[itemKey];

      // console.dir(item, { depth: null });

      const itemData = await services.evaluations.add(item);
      grades[itemKey] = { ...itemData };
    }

    return grades;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initGrades;
