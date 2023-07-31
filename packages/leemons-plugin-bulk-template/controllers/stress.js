/* eslint-disable no-unreachable */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const path = require('path');
const Pool = require('async-promise-pool');
const { find, compact, isNil, padStart, isEmpty, map, uniq } = require('lodash');
const initPlatform = require('../src/platform');
const initProviders = require('../src/providers');
const initUsers = require('../src/users');
const initCenters = require('../src/centers');
const initProfiles = require('../src/profiles');
const initGrades = require('../src/grades');
const initAcademicPortfolio = require('../src/academicPortfolio');
const { initLibrary } = require('../src/leebrary');
const initWidgets = require('../src/widgets');
const importSubjects = require('../src/bulk/academic-portfolio/subjects');

const subjectsPool = new Pool({ concurrency: 1 });

function getOrderedName({ id, prefix = 'G', precision = 4 }) {
  const n = Number(id);
  return `${prefix}${padStart((n + 1).toString(), precision, '0')}`;
}

function generateStudent({
  id,
  profile,
  center,
  avatar = 'https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/empresa3_12c682ca41.jpg',
  precision = 4,
}) {
  const name = getOrderedName({ id, prefix: 'student', precision });
  const nameEmail = getOrderedName({ id, prefix: '', precision });

  const student = {
    name,
    surnames: 'Demo',
    email: `student+${nameEmail}@leemons.io`,
    password: 'testing',
    locale: 'es',
    avatar,
  };
  student.roles = [
    { profile: profile.id, center: center.id, profileKey: 'student', profileRole: profile.role },
  ];
  student.tags = ['Student'];
  student.gender = ['male', 'female'][Math.round(Math.random())];

  const [day, month, year] = '01/01/1980'.split('/');
  student.birthdate = new Date(year, month - 1, day);

  return student;
}

async function addUser(user) {
  const { services } = leemons.getPlugin('users');
  const { roles, ...item } = user;

  let itemRoles = await Promise.all(
    roles
      .filter((rol) => rol.center)
      .map((rol) => services.profiles.getRoleForRelationshipProfileCenter(rol.profile, rol.center))
  );

  if (isEmpty(itemRoles)) {
    itemRoles = roles.map((rol) => ({ id: rol.profileRole }));
  }

  leemons.log.debug(`Adding user: ${item.name}`);
  const itemData = await services.users.add({ ...item, active: true }, map(itemRoles, 'id'));
  leemons.log.info(`User ADDED: ${item.name}`);

  const userProfiles = roles.map((rol) => rol.profileKey);

  return { ...itemData, profiles: uniq(userProfiles) };
}

async function addSubjectAndClassroom({
  key,
  subjects,
  users,
  programs,
  apProfiles,
  profiles,
  nStudents = 1,
  nGroups = 1,
  studentOffset = 0,
}) {
  const { services } = leemons.getPlugin('academic-portfolio');
  const { services: userService } = leemons.getPlugin('users');
  const {
    classes: baseClasses,
    creator,
    courses,
    students: baseStudent,
    seats,
    ...subject
  } = subjects[key];
  const baseClass = baseClasses[0];
  const programData = find(programs, { id: subject.program });
  const [centerId] = programData.centers;

  const studentsPool = new Pool({ concurrency: 1 });

  try {
    // ·····················································
    // STUDENTS
    leemons.log.debug(`Adding students in pool for subject: ${subject.name}`);
    Object.keys([...Array(nStudents * nGroups)]).forEach((id) =>
      studentsPool.add(() =>
        addUser(
          generateStudent({
            id: Number(id) + studentOffset,
            profile: profiles.student,
            center: { id: centerId },
            precision: String(subjects.length * nStudents * nGroups).length,
          })
        )
      )
    );

    leemons.log.debug('Batch processing students ...');
    const students = await studentsPool.all();
    leemons.log.info('Students CREATED');

    // console.dir(students[0], { depth: null });

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
    const groups = Object.keys([...Array(nGroups)]).map((id) => {
      const abbreviation = getOrderedName({ id, precision: 4 });
      return { name: abbreviation, abbreviation, program: subject.program };
    });

    // First create the class group
    const groupsData = await Promise.all(
      groups.map((group) => {
        if (group) return services.groups.addGroupIfNotExists(group);
        return null;
      })
    );

    // Then create the classes
    const classes = groups.map((group) => {
      const classroom = {
        ...baseClass,
        group,
        schedule: null,
      };

      return classroom;
    });
    const classesData = [];

    leemons.log.debug(`Adding classrooms ...`);

    for (let i = 0, l = classes.length; i < l; i++) {
      const { program, teachers, students: classStudents, ...rest } = classes[i];

      const teachersData = await Promise.all(
        teachers.map(({ teacher }) =>
          userService.users.getUserAgentByCenterProfile(teacher, centerId, apProfiles.teacher)
        )
      );

      // Todo : Mover los seats de la asignatura a la clase
      const classroomData = {
        ...rest,
        program,
        seats: 999999,
        subject: subjectData.id,
        group: groupsData[i]?.id,
        teachers: teachersData.map((teacherData) => {
          const teacher = find(teachers, { teacher: teacherData.user });
          return { teacher: teacherData.id, type: teacher.type };
        }),
        schedule: [],
      };

      // console.dir(Object.keys(classroomData));

      const classroom = await services.classes.addClass(classroomData, {
        userSession: users[creator],
      });

      classesData.push(classroom);

      // ·····································
      // ADD STUDENTS TO CLASS

      if (students && students.length > 0) {
        const studentsData = compact(students).filter(
          (student) => !isNil(student.userAgents[0]?.id)
        );

        if (studentsData && studentsData.length > 0) {
          const studentsFrom = i * nStudents;
          const data = {
            class: [classroom.id],
            students: studentsData
              .slice(studentsFrom, studentsFrom + nStudents)
              .map(({ userAgents }) => userAgents[0].id),
          };

          await services.classes.addStudentsToClasses(data);
        }
      }
    }
    leemons.log.debug(`Subject ADDED: ${subject.name}`);

    subjects[key].classes = classesData;

    return subjects[key];
  } catch (error) {
    console.log('-- ERROR: Subject cannot be imported');
    console.log(error);
    return false;
  }
}

async function loadData(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      n_groups: { type: 'number' },
      n_students: { type: 'number' },
    },
    required: ['n_groups', 'n_students'],
    additionalProperties: true,
  });
  if (validator.validate(ctx.request.body)) {
    const { chalk } = global.utils;
    const docPath = path.resolve(__dirname, '../stress_base.xlsx');
    const nStudents = ctx.request.body.n_students;
    const nGroups = ctx.request.body.n_groups;

    // ·······························································
    // PLATFORM & LOCALES

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Init Platform & locales ...}`);

    // await initLocales(docPath);
    await initPlatform(docPath);

    leemons.log.info(chalk`{cyan.bold BULK} Platform initialized`);

    // ·······························································
    // PROVIDERS

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Init Providers ...}`);

    await initProviders(docPath);

    leemons.log.info(chalk`{cyan.bold BULK} Providers initialized`);

    // ·······························································
    // CENTERS, PROFILES & USERS

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Users plugin ...}`);

    const centers = await initCenters(docPath);
    const profiles = await initProfiles(docPath);
    const users = await initUsers(docPath, centers, profiles);

    leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Users plugin`);

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Academic Rules plugin ...}`);

    const grades = await initGrades(docPath, centers);

    leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Academic Rules plugin`);

    // ·······························································
    // ACADEMIC PORTFOLIO

    leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Academic Portfolio plugin ...}`);

    const { programs, knowledgeAreas, subjectTypes, weekdays, apProfiles } =
      await initAcademicPortfolio(docPath, { centers, profiles, users, grades }, true, true);

    const subjects = await importSubjects(docPath, {
      programs,
      knowledgeAreas,
      subjectTypes,
      users,
      weekdays,
    });

    // console.dir(subjects, { depth: null });
    leemons.log.debug('Init Subject Pool ...');

    const subjectsKeys = Object.keys(subjects);

    leemons.log.debug(`Loading ${subjectsKeys.length} subjects`);

    for (let i = 0, len = subjectsKeys.length; i < len; i++) {
      const key = subjectsKeys[i];
      subjectsPool.add(() =>
        addSubjectAndClassroom({
          key,
          subjects,
          users,
          programs,
          apProfiles,
          profiles,
          nStudents,
          nGroups,
          studentOffset: i * nStudents * nGroups,
        })
      );
    }

    leemons.log.debug('Launch Subject Pool ...');

    await subjectsPool.all();

    leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Academic Portfolio plugin`);

    // ·······························································
    // MEDIA LIBRARY
    /*
    leemons.log.debug(chalk`{cyan.bold BULK} {gray Starting Leebrary plugin ...}`);

    const assets = await initLibrary(docPath, { users });

    leemons.log.info(chalk`{cyan.bold BULK} COMPLETED Leebrary plugin`);
    */

    ctx.status = 200;
    ctx.body = { status: 200, subjects };
  } else {
    throw validator.error;
  }
}

module.exports = { load: loadData };
