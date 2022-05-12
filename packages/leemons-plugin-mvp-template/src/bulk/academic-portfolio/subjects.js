const { keys, isEmpty, find, trim } = require('lodash');
const path = require('path');
const itemsImport = require('../helpers/simpleListImport');

async function importAcademicPortfolioSubjects({ programs, users, knowledgeAreas, subjectTypes }) {
  const filePath = path.resolve(__dirname, '../data.xlsx');
  const items = await itemsImport(filePath, 'ap_subjects', 20, false, true);

  keys(items).forEach((key) => {
    const item = items[key];
    const programKey = item.program;
    const program = programs[programKey];
    const programID = program?.id;
    items[key].program = programID;

    // Clean data here, becasuse autoDetect transform string 001 into number 1
    keys(items[key]).forEach((prop) => {
      if (isEmpty(items[key][prop])) {
        delete items[key][prop];
      }
    });

    // Teachers
    const teachers = items[key].teachers
      .split(',')
      .map((val) => trim(val))
      .filter((val) => !isEmpty(val))
      .map((userGroup) => {
        const [user, group] = userGroup.split('@');
        const [teacher, type] = user.split('|').map((val) => trim(val));
        // console.log('userAgents:');
        // console.dir(users[teacher].userAgents, { depth: null });
        return { teacher: users[teacher]?.id, type: `${type ? `${type}-` : ''}teacher`, group };
      });

    // Students
    let students = [];

    if (items[key].students && !isEmpty(items[key].students)) {
      students = items[key].students
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((userGroup) => {
          const [user, group] = userGroup.split('@');
          return { student: users[user]?.id, group };
        });
    }

    // Groups
    const groups = items[key].groups
      .split(',')
      .map((val) => trim(val))
      .filter((val) => !isEmpty(val))
      .map((group) => {
        const [name, abbreviation] = group.split('|');
        return { name, abbreviation, program: programID };
      });

    // Course
    const courseIndex = Number(item.course);
    items[key].course = find(program.courses, {
      index: courseIndex,
      type: 'course',
    })?.id;

    // ·····················································
    // CLASSES CONFIG

    items[key].classes = groups.map((group) => {
      const classroom = {
        program: programID,
        group,
        course: items[key].course,
        color: items[key].color,
      };

      const subjectTypeKey = item.subjectType;
      classroom.subjectType = subjectTypes[subjectTypeKey]?.id;

      const knowledgeKey = item.knowledge;
      classroom.knowledge = knowledgeAreas[knowledgeKey]?.id;

      // Teacher
      classroom.teachers = [find(teachers, { group: group.abbreviation })];

      // Students
      classroom.students = students.filter((student) => student.group === group.abbreviation);

      return classroom;
    });

    items[key].seats = Number(items[key].seats);

    delete items[key].groups;
    delete items[key].color;
    delete items[key].teachers;
    delete items[key].subjectType;
    delete items[key].knowledge;
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
  studentC01: { id: 'STUDENT01' },
};

importAcademicPortfolioSubjects({
  programs: PROGRAMS,
  users: USERS,
  knowledgeAreas: {},
  subjectTypes: {},
});
*/

module.exports = importAcademicPortfolioSubjects;
