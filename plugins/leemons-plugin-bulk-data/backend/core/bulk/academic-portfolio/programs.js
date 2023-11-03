const { keys, trim, isNil, isEmpty, toLower } = require('lodash');
const itemsImport = require('../helpers/simpleListImport');

async function importAcademicPortfolioPrograms(filePath, centers, grades) {
  const items = await itemsImport(filePath, 'ap_programs', 40, true, true);

  keys(items)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
      const program = items[key];

      // ·····················································
      // CENTERS

      program.centers = program.centers
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((val) => centers[val]?.id);

      // ·····················································
      // GRADES

      program.evaluationSystem = grades[program.evaluationSystem]?.id;

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
      // CYCLES

      if (!isEmpty(program.cycles)) {
        program.cycles = program.cycles
          .split(',')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val))
          .map((val) => {
            const [name, courses] = val.split('@');
            return {
              name,
              courses: courses
                .split('|')
                .filter((course) => !isEmpty(course))
                .map(Number),
            };
          });

        program.haveCycles = true;
      } else {
        program.haveCycles = false;
      }

      // ·····················································
      // SUBJECTS

      if (program.subjectsFirstDigit) {
        program.subjectsFirstDigit = 'course';
      } else {
        program.subjectsFirstDigit = 'none';
      }

      items[key] = program;
    });

  return items;
}

module.exports = importAcademicPortfolioPrograms;
