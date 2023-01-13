const { keys, isEmpty, find, trim, isNil } = require('lodash');
const itemsImport = require('../helpers/simpleListImport');

async function importAcademicPortfolioSubjects(
  filePath,
  { programs, users, knowledgeAreas, subjectTypes, weekdays }
) {
  const items = await itemsImport(filePath, 'ap_subjects', 30, false, false);

  const now = new Date();

  keys(items)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
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

      // Schedule
      const schedule = {};

      [...Array(7).keys()].forEach((day) => {
        const dayKey = `timetable.${day}`;
        const dayValue = items[key][dayKey];

        if (dayValue && !isEmpty(dayValue)) {
          const dayGroups = dayValue
            .split(',')
            .map((val) => trim(val))
            .filter((val) => !isEmpty(val));

          dayGroups.forEach((dayGroup) => {
            const [group, durationRaw] = dayGroup.split('@');
            const [start, end] = durationRaw.split('|');

            const [startH, startM] = start.split(':');
            const [endH, endM] = end.split(':');

            const startDate = new Date(new Date(now.setHours(startH)).setMinutes(startM));
            const endDate = new Date(new Date(now.setHours(endH)).setMinutes(endM));

            const duration = new Date(endDate - startDate).getTime() / (60 * 1000);

            if (!schedule[group]) {
              schedule[group] = [];
            }

            schedule[group].push({ dayWeek: day, start, end, duration, day: weekdays[day] });
            // { day: 1, value: 'G01@11:05|11:55' },
          });
        }

        delete items[key][dayKey];
      });

      // Teachers
      const teachers = items[key].teachers
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((userGroup) => {
          const [user, group] = userGroup.split('@');
          const [teacher, type] = user.split('|').map((val) => trim(val));

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
      let groups = (items[key].groups ?? '')
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((group) => {
          const [name, abbreviation] = group.split('|');
          return { name, abbreviation, program: programID };
        });

      if (groups.length === 0) {
        groups = [null];
      }

      // Course
      const courseIndexes = (item.course ?? '')
        .split('|')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map(Number);

      items[key].courses = courseIndexes.map(
        (index) =>
          find(program.courses, {
            index,
            type: 'course',
          })?.id
      );

      if (program.subjectsFirstDigit !== 'none') {
        [items[key].course] = items[key].courses;
      } else {
        items[key].course = null;
        delete items[key].course;
      }

      if (items[key].credits && !isEmpty(items[key].credits)) {
        items[key].credits = Number(items[key].credits);
      }

      // ·····················································
      // CLASSES CONFIG

      items[key].classes = groups.map((group) => {
        const classroom = {
          program: programID,
          group,
          course: items[key].courses,
          color: items[key].color,
          schedule: schedule[group ? group.abbreviation : ''],
        };

        if (!classroom.course.length) {
          delete classroom.course;
        }

        const subjectTypeKey = item.subjectType;
        classroom.subjectType = subjectTypes[subjectTypeKey]?.id;

        const knowledgeKey = item.knowledge;
        classroom.knowledge = knowledgeAreas[knowledgeKey]?.id;

        // Teacher
        classroom.teachers = teachers.filter((teacher) =>
          group ? teacher.group === group.abbreviation : true
        );

        // Students
        classroom.students = students.filter((student) =>
          group ? student.group === group.abbreviation : true
        );

        return classroom;
      });

      items[key].seats = Number(items[key].seats);

      delete items[key].groups;
      delete items[key].color;
      delete items[key].teachers;
      delete items[key].subjectType;
      delete items[key].knowledge;
      delete items[key][' '];

      // Cleans empty keys
      keys(items[key]).forEach((prop) => {
        if (isEmpty(trim(prop))) {
          delete items[key][prop];
        }
      });
    });

  // console.dir(items.subject20, { depth: null });
  return items;
}

module.exports = importAcademicPortfolioSubjects;
