const { keys, isEmpty, find, trim, isNil } = require('lodash');
const itemsImport = require('../helpers/simpleListImport');

async function importAcademicPortfolioClasses(
  filePath,
  { programs, subjects, knowledgeAreas, subjectTypes, users }
) {
  const items = await itemsImport(filePath, 'ap_classes', 20);

  keys(items)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
      const item = items[key];

      const programKey = item.program;
      const program = programs[programKey];
      const programID = program?.id;
      items[key].program = programID;

      const subjectKey = item.subject;
      items[key].subject = subjects[subjectKey]?.id;

      const subjectTypeKey = item.subjectType;
      items[key].subjectType = subjectTypes[subjectTypeKey]?.id;

      const knowledgeKey = item.knowledge;
      items[key].knowledge = knowledgeAreas[knowledgeKey]?.id;

      // Courses
      const courseIndex = item.course;
      items[key].course = find(program.courses, {
        index: courseIndex,
        type: 'course',
      })?.id;

      // Groups
      items[key].groups = items[key].groups
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((group) => {
          const [name, abbreviation] = group.split('|');
          return { name, abbreviation, program: programID };
        });

      // Teachers
      items[key].teachers = items[key].teachers
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((userKey) => users[userKey]?.id);
    });

  // console.dir(items, { depth: null });
  return items;
}

// ·····················································
// TESTING
/*
const PROGRAMS = {
  programA: {
    id: 'PA',
    courses: [
      { id: 'CA1', index: 1, type: 'course' },
      { id: 'CA2', index: 2, type: 'course' },
    ],
  },
  programB: {
    id: 'PB',
    courses: [
      { id: 'CB1', index: 1, type: 'course' },
      { id: 'CB2', index: 2, type: 'course' },
    ],
  },
};

const USERS = {
  teacher01: { id: 'TEACHER01' },
};

importAcademicPortfolioClasses({
  programs: PROGRAMS,
  subjects: {},
  knowledgeAreas: {},
  subjectTypes: {},
  users: USERS,
});
*/
module.exports = importAcademicPortfolioClasses;
