/* eslint-disable no-param-reassign */
/* eslint-disable no-unreachable */
/* eslint-disable no-await-in-loop */
const { keys, find, compact, isNil } = require('lodash');
const Pool = require('async-promise-pool');
const importProfiles = require('./bulk/academic-portfolio/profiles');
const importPrograms = require('./bulk/academic-portfolio/programs');
const importSubjectTypes = require('./bulk/academic-portfolio/subjectTypes');
const importKnowledgeAreas = require('./bulk/academic-portfolio/knowledgeAreas');
const importSubjects = require('./bulk/academic-portfolio/subjects');

const pool = new Pool({ concurrency: 1 });

async function _addSubjectAndClassroom(key, subjects, users, programs, apProfiles) {
  const { services } = leemons.getPlugin('academic-portfolio');
  const { services: userService } = leemons.getPlugin('users');
  const { classes, seats, creator, students: rawStudents, courses, ...subject } = subjects[key];

  try {
    leemons.log.debug(`Adding subject: ${subject.name}`);
    const subjectData = await services.subjects.addSubject(subject, {
      userSession: users[creator],
    });
    subjects[key] = { ...subjectData };

    const programKey = Object.keys(programs).filter(
      (val) => programs[val].id === subject.program
    )[0];
    programs[programKey].subjects[key] = subjects[key];

    // ·····················································
    // CLASSES

    leemons.log.debug(`Adding groups ...`);
    const groups = classes.map((classroom) => classroom.group);

    // First create the class group
    const groupsData = await Promise.all(
      groups.map((group) => services.groups.addGroupIfNotExists(group))
    );

    // Then create the classes
    const classesData = [];

    leemons.log.debug(`Adding classrooms ...`);

    for (let j = 0, l = classes.length; j < l; j++) {
      const { program, teachers, students, ...rest } = classes[j];
      const programData = find(programs, { id: program });
      const [center] = programData.centers;

      const teachersData = await Promise.all(
        // eslint-disable-next-line no-loop-func
        teachers.map(({ teacher }) =>
          userService.users.getUserAgentByCenterProfile(teacher, center, apProfiles.teacher)
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
        let studentsData = await Promise.all(
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

        studentsData = compact(studentsData).filter((item) => !isNil(item?.id));

        if (studentsData && studentsData.length > 0) {
          const data = {
            class: [classroom.id],
            students: studentsData.map(({ id }) => id),
          };

          await services.classes.addStudentsToClasses(data);
        }
      }
    }
    leemons.log.debug(`Subject ADDED: ${subject.name}`);

    subjects[key].classes = classesData;
  } catch (error) {
    console.log('-- ERROR: Subject cannot be imported');
    console.log(error);
  }
}

async function initAcademicPortfolio({ centers, profiles, users, grades }) {
  const { services } = leemons.getPlugin('academic-portfolio');
  const { timetable } = leemons.getPlugin('timetable').services;
  const { weekdays } = timetable;

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
      const knowledgeAreaData = await services.knowledges.addKnowledge({
        ...knowledgeArea,
        credits_program: null,
      });
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
      weekdays,
    });
    const subjectsKeys = keys(subjects);

    for (let i = 0, len = subjectsKeys.length; i < len; i++) {
      const key = subjectsKeys[i];
      pool.add(() => _addSubjectAndClassroom(key, subjects, users, programs, apProfiles));
    }

    leemons.log.debug('Batch processing Subjects & Classrooms ...');
    await pool.all();
    leemons.log.info('Classrooms CREATED');

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
