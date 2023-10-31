/* eslint-disable no-await-in-loop */
const { keys } = require('lodash');
const importGrades = require('./bulk/grades');

async function initGrades({ file, centers, ctx }) {
  try {
    const grades = await importGrades(file, centers);
    const itemsKeys = keys(grades);

    for (let i = 0, len = itemsKeys.length; i < len; i++) {
      const itemKey = itemsKeys[i];
      const item = grades[itemKey];

      const itemData = await ctx.call('grades.evaluations.add', { data: item });
      grades[itemKey] = { ...itemData };
    }

    return grades;
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

module.exports = initGrades;
