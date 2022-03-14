const { keys, trim, isEmpty, toLower } = require('lodash');
const path = require('path');
const itemsImport = require('../helpers/simpleListImport');

async function importAcademicPortfolioPrograms(centers) {
  const filePath = path.resolve(__dirname, '../data.xlsx');
  const items = await itemsImport(filePath, 'ap_programs', 30, true, true);

  keys(items).forEach((key) => {
    const program = items[key];

    // ·····················································
    // CENTERS

    program.centers = program.centers
      .split(',')
      .map((val) => trim(val))
      .filter((val) => !isEmpty(val))
      .map((val) => centers[val]?.id);

    // ·····················································
    // SUBSTAGES

    if (!isEmpty(program.substages)) {
      program.substages = program.substages
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((val) => {
          const [name, abbreviation] = val.split('|');
          return { name, abbreviation };
        });

      program.substagesFrequency = toLower(program.substagesFrequency);
      program.haveSubstagesPerCourse = true;
      program.numberOfSubstages = program.substages.length;
      program.useDefaultSubstagesName = false;
    } else {
      program.haveSubstagesPerCourse = false;
    }

    // ·····················································
    // SUBJECTS

    if (program.subjectsFirstDigit) {
      program.subjectsFirstDigit = 'course';
    } else {
      program.subjectsFirstDigit = '';
    }

    items[key] = program;
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

importAcademicPortfolioPrograms(CENTERS);
*/
module.exports = importAcademicPortfolioPrograms;
