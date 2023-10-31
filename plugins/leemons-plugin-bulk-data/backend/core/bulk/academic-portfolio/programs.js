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

  // console.dir(items, { depth: null });
  /*
  const mock = {
    name: 'Leemons Corporate Training',
    abbreviation: 'LCT',
    color: '#6989bf',
    credits: null,
    creditSystem: false,
    maxNumberOfCourses: 1,
    courseCredits: 0,
    hideCoursesInTree: false,
    customSubstages: [],
    haveKnowledge: true,
    maxKnowledgeAbbreviation: 3,
    maxKnowledgeAbbreviationIsOnlyNumbers: false,
    useOneStudentGroup: false,
    allSubjectsSameDuration: true,
    maxGroupAbbreviation: 3,
    maxGroupAbbreviationIsOnlyNumbers: false,
    subjectsDigits: 0,
    oneStudentGroup: false,
    evaluationSystem: '222e7f49-90c0-43fc-95a3-9f7dca818dad',
    haveSubstagesPerCourse: false,
    moreThanOneAcademicYear: false,
    subjectsFirstDigit: 'none',
    centers: ['f4de5323-611d-466f-b551-34b6c7c8fb5a'],
  };
  */

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
