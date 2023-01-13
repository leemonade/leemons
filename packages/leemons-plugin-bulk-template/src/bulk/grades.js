const { keys, trim, isEmpty, isNil, toLower } = require('lodash');
const itemsImport = require('./helpers/simpleListImport');

async function importGrades(filePath, centers) {
  const items = await itemsImport(filePath, 'ar_evaluations', 20);

  keys(items)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
      const grade = items[key];
      grade.center = centers[grade.center]?.id;
      grade.type = toLower(grade.type);
      grade.minScaleToPromote = Number(grade.minScaleToPromote);

      if (grade.type !== 'numeric') {
        delete grade.isPercentage;
      }

      grade.scales = grade.scales
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((scale) => {
          const props = scale.split('|');
          if (grade.type === 'numeric') {
            const [number, description] = props;
            return { number: Number(number), description };
          }

          const [letter, number, description] = props;
          return { letter, number: Number(number), description };
        });

      items[key] = grade;
    });

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

importGrades(CENTERS);
*/
module.exports = importGrades;
