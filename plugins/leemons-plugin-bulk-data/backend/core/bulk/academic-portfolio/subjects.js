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

      // ·····················································
      // SCHEDULE
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
            const [classIdentifier, durationRaw] = dayGroup.split('@');
            const [start, end] = durationRaw.split('|');

            const [startH, startM] = start.split(':');
            const [endH, endM] = end.split(':');

            const startDate = new Date(new Date(now.setHours(startH)).setMinutes(startM));
            const endDate = new Date(new Date(now.setHours(endH)).setMinutes(endM));

            const duration = new Date(endDate - startDate).getTime() / (60 * 1000);

            if (!schedule[classIdentifier]) {
              schedule[classIdentifier] = [];
            }

            schedule[classIdentifier].push({
              dayWeek: day,
              start,
              end,
              duration,
              day: weekdays[day],
            });
            // { day: 1, value: 'G01@11:05|11:55' },
          });
        }

        delete items[key][dayKey];
      });

      // ·····················································
      // TEACHERS

      const teachers = (items[key].teachers || '')
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((value) => {
          const [user, classIdentifier] = value.split('@');
          const [teacher, type] = user.split('|').map((val) => trim(val));

          return {
            teacher: users[teacher]?.id,
            type: type ? `${type}-teacher` : 'teacher',
            classIdentifier: Number(classIdentifier),
          };
        });

      // ·····················································
      // STUDENTS

      let students = [];

      if (items[key].students && !isEmpty(items[key].students)) {
        students = items[key].students
          .split(',')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val))
          .map((value) => {
            const [user, classIdentifier] = value.split('@');
            return { student: users[user]?.id, classIdentifier: Number(classIdentifier) };
          });
      }

      // ·····················································
      // COURSES

      const courseIndexes = (item.courses ?? '')
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

      // Subjects creation needs a stringified array of courses
      items[key].course = JSON.stringify(items[key].courses);

      // ·····················································
      // CREDITS

      if (items[key].credits && !isEmpty(items[key].credits)) {
        // It is mandatory for the subject to have a minimum of 1 credit
        items[key].credits = Number(items[key].credits) > 0 ? Number(items[key].credits) : 1;
      }

      // ·····················································
      // SUBSTAGES

      let substage = '';
      if (program.numberOfSubstages > 0 && items[key].substage?.length) {
        substage += program.substages.find(
          (ss) => ss.abbreviation === trim(items[key].substage)
        ).id;
      }

      // ·····················································
      // CLASSES CONFIG

      const classGroups = [];
      const classrooms = [];
      const classesCustomIds = {};

      if (items[key].classesCustomIds && !isEmpty(items[key].classesCustomIds)) {
        items[key].classesCustomIds
          .split(',')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val))
          .forEach((value) => {
            const [classIdentifier, classroomId] = value.split(':');
            classesCustomIds[classIdentifier] = classroomId;
          });
      }

      if (program.groups && items[key].groupsAmount) {
        const { groupsAmount } = items[key];
        const sortedProgramGroups = program.groups
          .filter((group) => courseIndexes.includes(group.metadata.course))
          .sort((a, b) => a.index - b.index);

        classGroups.push(
          ...sortedProgramGroups.slice(0, groupsAmount).map((group) => ({
            group: group.id,
            classroomId: classesCustomIds[group.index] ?? null,
            seats: program.courses.find((course) => course.index === group.metadata.course).metadata
              .seats,
          }))
        );
      }

      if (items[key].classrooms && !classGroups?.length) {
        classrooms.push(
          ...items[key].classrooms
            .split(',')
            .map((val) => trim(val))
            .filter((val) => !isEmpty(val))
            .map((classroom) => {
              const [index, classInfo] = classroom.split(':');
              const [seats, alias] = classInfo.split('@');

              return {
                classWithoutGroupId: index,
                classroomId: classesCustomIds[index] ?? null,
                seats: Number(seats),
                alias: alias ?? null,
              };
            })
        );
      }

      const classesToCreate = classGroups.length ? classGroups : classrooms;

      items[key].classes = classesToCreate.map((cls) => {
        const classroom = {
          ...cls,
          program: programID,
          course: items[key].courses,
          color: items[key].color,
        };

        const subjectTypeKey = item.subjectType;
        if (subjectTypeKey && program.hasSubjectTypes) {
          classroom.subjectType = subjectTypes[subjectTypeKey]?.id;
        }

        const knowledgeAreaKey = item.knowledgeArea;
        if (knowledgeAreaKey && program.hasKnowledgeAreas) {
          classroom.knowledgeArea = knowledgeAreas[knowledgeAreaKey]?.id;
        }

        // Schedule
        if (!isEmpty(schedule)) {
          classroom.schedule =
            schedule[
              classroom.group
                ? program.groups.find((gr) => gr.id === classroom.group).index
                : classroom.classWithoutGroupId
            ];
        }

        // Teacher
        classroom.teachers = teachers.filter((teacher) =>
          classroom.group
            ? teacher.classIdentifier ===
              program.groups.find((gr) => gr.id === classroom.group).index
            : teacher.classIdentifier === Number(classroom.classWithoutGroupId)
        );

        // Students
        classroom.students = students.filter((student) =>
          classroom.group
            ? student.classIdentifier ===
              program.groups.find((gr) => gr.id === classroom.group).index
            : student.classIdentifier === Number(classroom.classWithoutGroupId)
        );

        // Format classWithoutGroupId to have three digits
        if (classroom.classWithoutGroupId) {
          classroom.classWithoutGroupId = classroom.classWithoutGroupId.padStart(3, '0');
        }

        // Substage
        if (substage.length) {
          classroom.substage = substage;
        }

        return classroom;
      });

      delete items[key].groupsAmount;
      delete items[key].classrooms;
      delete items[key].teachers;
      delete items[key].students;
      delete items[key].subjectType;
      delete items[key].knowledgeArea;
      delete items[key].substage;
      delete items[key].courses;
      delete items[key].classesCustomIds;
      delete items[key].substage;
      delete items[key][' '];

      // Cleans empty keys
      keys(items[key]).forEach((prop) => {
        if (isEmpty(trim(prop))) {
          delete items[key][prop];
        }
      });
    });

  return items;
}

module.exports = importAcademicPortfolioSubjects;
