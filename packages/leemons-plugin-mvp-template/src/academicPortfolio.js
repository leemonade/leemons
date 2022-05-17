/* eslint-disable no-unreachable */
/* eslint-disable no-await-in-loop */
const { keys, find, compact, findIndex } = require('lodash');
const importProfiles = require('./bulk/academic-portfolio/profiles');
const importPrograms = require('./bulk/academic-portfolio/programs');
const importSubjectTypes = require('./bulk/academic-portfolio/subjectTypes');
const importKnowledgeAreas = require('./bulk/academic-portfolio/knowledgeAreas');
const importSubjects = require('./bulk/academic-portfolio/subjects');

async function initAcademicPortfolio({ centers, profiles, users, grades }) {
  const { services } = leemons.getPlugin('academic-portfolio');

  try {
    // ·····················································
    // SETTINGS

    let apProfiles = await importProfiles(profiles);
    apProfiles = await services.settings.setProfiles(apProfiles);

    // ·····················································
    // PROGRAMS

    const programs = await importPrograms(centers, grades);
    const programsKeys = keys(programs);

    for (let i = 0, len = programsKeys.length; i < len; i++) {
      const { creator, ...program } = programs[programsKeys[i]];
      const programData = await services.programs.addProgram(program, {
        userSession: users[creator],
      });
      programs[programsKeys[i]] = { ...programData, subjects: {} };
    }

    // ·····················································
    // KNOWLEDGE AREAS

    const knowledgeAreas = await importKnowledgeAreas(programs);
    const knowledgeAreasKeys = keys(knowledgeAreas);

    for (let i = 0, len = knowledgeAreasKeys.length; i < len; i++) {
      const key = knowledgeAreasKeys[i];
      const knowledgeArea = knowledgeAreas[key];
      const knowledgeAreaData = await services.knowledges.addKnowledge(knowledgeArea);
      knowledgeAreas[key] = { ...knowledgeAreaData };
    }

    // ·····················································
    // SUBJECT TYPES

    const subjectTypes = await importSubjectTypes(programs);
    const subjectTypesKeys = keys(subjectTypes);

    for (let i = 0, len = subjectTypesKeys.length; i < len; i++) {
      const key = subjectTypesKeys[i];
      const subjectType = subjectTypes[key];
      const subjectTypeData = await services.subjectType.addSubjectType(subjectType);
      subjectTypes[key] = { ...subjectTypeData };
    }

    // ·····················································
    // SUBJECTS

    const subjects = await importSubjects({
      programs,
      knowledgeAreas,
      subjectTypes,
      users,
    });
    const subjectsKeys = keys(subjects);

    for (let i = 0, len = subjectsKeys.length; i < len; i++) {
      const key = subjectsKeys[i];
      const { classes, seats, creator, students: rawStudents, ...subject } = subjects[key];
      const subjectData = await services.subjects.addSubject(subject, {
        userSession: users[creator],
      });
      subjects[key] = { ...subjectData };
      const programIndex = findIndex(programs, { id: subjectData.program });
      programs[programIndex].subjects[key] = { ...subjectData };

      // ·····················································
      // CLASSES

      const groups = classes.map((classroom) => classroom.group);

      // First create the class group
      const groupsData = await Promise.all(
        groups.map((group) => services.groups.addGroupIfNotExists(group))
      );

      // Then create the classes
      const classesData = [];

      for (let j = 0, l = classes.length; j < l; j++) {
        const { program, teachers, students, ...rest } = classes[j];
        const programData = find(programs, { id: program });
        const [center] = programData.centers;

        const teachersData = await Promise.all(
          teachers.map(({ teacher }) =>
            leemons
              .getPlugin('users')
              .services.users.getUserAgentByCenterProfile(teacher, center, apProfiles.teacher)
          )
        );

        // Todo : Mover los seats de la asignatura a la clase
        const classroomData = {
          ...rest,
          program,
          seats,
          subject: subjectData.id,
          group: groupsData[j].id,
          teachers: teachersData.map((teacherData) => {
            const teacher = find(teachers, { teacher: teacherData.user });
            return { teacher: teacherData.id, type: teacher.type };
          }),
        };

        const classroom = await services.classes.addClass(classroomData, {
          userSession: users[creator],
        });

        classesData.push(classroom);

        // ·····································
        // ADD STUDENTS TO CLASS

        if (students && students.length > 0) {
          const studentsData = await Promise.all(
            students.map((item) => {
              if (item?.student) {
                return leemons
                  .getPlugin('users')
                  .services.users.getUserAgentByCenterProfile(
                    item.student,
                    center,
                    apProfiles.student
                  );
              }
              return null;
            })
          );

          if (studentsData && studentsData.length > 0) {
            const data = {
              class: [classroom.id],
              students: studentsData.map(({ id }) => id),
            };

            await services.classes.addStudentsToClasses(data);
          }
        }
      }

      subjects[key].classes = classesData;
    }

    // ·····················································
    // MENU BUILDER
    await services.settings.enableAllMenuItems();

    return programs;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initAcademicPortfolio;
