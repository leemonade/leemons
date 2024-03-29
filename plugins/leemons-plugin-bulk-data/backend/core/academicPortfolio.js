/* eslint-disable no-param-reassign */
/* eslint-disable no-unreachable */
/* eslint-disable no-await-in-loop */
const { keys, find, compact, isNil, omit } = require('lodash');
const Pool = require('async-promise-pool');
const importProfiles = require('./bulk/academic-portfolio/profiles');
const importPrograms = require('./bulk/academic-portfolio/programs');
const importSubjectTypes = require('./bulk/academic-portfolio/subjectTypes');
const importKnowledgeAreas = require('./bulk/academic-portfolio/knowledgeAreas');
const importSubjects = require('./bulk/academic-portfolio/subjects');

async function _addSubjectAndClassroom({ key, subjects, users, programs, apProfiles, ctx }) {
  const { classes, seats, creator, courses, ...subject } = subjects[key];

  try {
    ctx.logger.debug(`Adding subject: ${subject.name}`);
    const subjectData = await ctx.call(
      'academic-portfolio.subjects.addSubject',
      {
        data: omit(subject, 'students'),
      },
      { meta: { userSession: { ...users[creator] } } }
    );
    subjects[key] = { ...subjectData };

    const programKey = Object.keys(programs).filter(
      (val) => programs[val].id === subject.program
    )[0];
    programs[programKey].subjects[key] = subjects[key];

    // ·····················································
    // CLASSES

    ctx.logger.debug(`Adding groups ...`);
    const groups = classes.map((classroom) => classroom.group);

    // First create the class group
    const groupsData = await Promise.all(
      groups.map((group) => {
        if (group)
          return ctx.call('academic-portfolio.groups.addGroupIfNotExists', {
            group,
          });
        return null;
      })
    );

    // Then create the classes
    const classesData = [];

    ctx.logger.debug(`Adding classrooms ...`);

    for (let j = 0, l = classes.length; j < l; j++) {
      const { program, teachers, students, ...rest } = classes[j];
      const programData = find(programs, { id: program });
      const [center] = programData.centers;

      const teachersData = await Promise.all(
        // eslint-disable-next-line no-loop-func
        teachers.map(({ teacher }) =>
          ctx.call('users.users.getUserAgentByCenterProfile', {
            userId: teacher,
            centerId: center,
            profileId: apProfiles.teacher,
          })
        )
      );

      // To implement : Mover los seats de la asignatura a la clase
      const classroomData = {
        ...rest,
        program,
        seats,
        subject: subjectData.id,
        group: groupsData[j]?.id,
        teachers: teachersData.map((teacherData) => {
          const teacher = find(teachers, { teacher: teacherData.user });
          return { teacher: teacherData.id, type: teacher.type };
        }),
      };

      const classroom = await ctx.call(
        'academic-portfolio.classes.addClass',
        {
          data: classroomData,
        },
        { meta: { userSession: { ...users[creator] } } }
      );

      classesData.push(classroom);

      // ·····································
      // ADD STUDENTS TO CLASS

      if (students && students.length > 0) {
        let studentsData = await Promise.all(
          students.map((item) => {
            if (item?.student) {
              return ctx.call('users.users.getUserAgentByCenterProfile', {
                userId: item.student,
                centerId: center,
                profileId: apProfiles.student,
              });
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

          await ctx.call('academic-portfolio.classes.addStudentsToClasses', {
            data,
          });
        }
      }
    }
    ctx.logger.debug(`Subject ADDED: ${subject.name}`);

    subjects[key].classes = classesData;
  } catch (error) {
    ctx.logger.log('-- ERROR: Subject cannot be imported');
    ctx.logger.log(error);
  }
}

async function initAcademicPortfolio({
  file,
  config: { centers, profiles, users, grades },
  skipSubjects = false,
  returnAll = false,
  ctx,
}) {
  const weekdays = await ctx.call('timetable.timetable.getWeekdays');
  const pool = new Pool({ concurrency: 1 });
  try {
    // ·····················································
    // SETTINGS

    let apProfiles = await importProfiles(file, profiles);
    apProfiles = await ctx.call('academic-portfolio.settings.setProfiles', { ...apProfiles });

    // ·····················································
    // PROGRAMS

    const programs = await importPrograms(file, centers, grades);
    const programsKeys = keys(programs);

    for (let i = 0, len = programsKeys.length; i < len; i++) {
      const { creator, ...program } = programs[programsKeys[i]];
      const programData = await ctx.call('academic-portfolio.programs.addProgram', {
        data: program,
        userSession: users[creator],
      });
      programs[programsKeys[i]] = { ...programData, subjects: {} };
    }

    // ·····················································
    // KNOWLEDGE AREAS

    const knowledgeAreas = await importKnowledgeAreas(file, programs);
    const knowledgeAreasKeys = keys(knowledgeAreas);

    for (let i = 0, len = knowledgeAreasKeys.length; i < len; i++) {
      const key = knowledgeAreasKeys[i];
      const knowledgeArea = knowledgeAreas[key];
      ctx.logger.debug(`Adding Knowledge area: ${knowledgeArea.name}`);

      try {
        const knowledgeAreaData = await ctx.call('academic-portfolio.knowledges.addKnowledge', {
          data: {
            ...knowledgeArea,
            credits_program: null,
          },
        });
        knowledgeAreas[key] = { ...knowledgeAreaData };
        ctx.logger.info(`Knowledge area ADDED: ${knowledgeArea.name}`);
      } catch (error) {
        ctx.logger.log('-- ERROR: Knowledge area cannot be imported');
        ctx.logger.log(error);
      }
    }

    // ·····················································
    // SUBJECT TYPES

    const subjectTypes = await importSubjectTypes(file, programs);
    const subjectTypesKeys = keys(subjectTypes);

    for (let i = 0, len = subjectTypesKeys.length; i < len; i++) {
      const key = subjectTypesKeys[i];
      const subjectType = subjectTypes[key];
      const subjectTypeData = await ctx.call('academic-portfolio.subjectType.addSubjectType', {
        data: subjectType,
      });
      subjectTypes[key] = { ...subjectTypeData };
    }

    // ·····················································
    // SUBJECTS

    if (!skipSubjects) {
      const subjects = await importSubjects(file, {
        programs,
        knowledgeAreas,
        subjectTypes,
        users,
        weekdays,
      });
      const subjectsKeys = keys(subjects);

      for (let i = 0, len = subjectsKeys.length; i < len; i++) {
        const key = subjectsKeys[i];
        pool.add(() =>
          _addSubjectAndClassroom({ key, subjects, users, programs, apProfiles, ctx })
        );
      }

      ctx.logger.debug('Batch processing Subjects & Classrooms ...');
      await pool.all();
      ctx.logger.info('Classrooms CREATED');
    }

    // ·····················································
    // MENU BUILDER
    await ctx.call('academic-portfolio.settings.enableAllMenuItems');

    if (returnAll) {
      return {
        programs,
        knowledgeAreas,
        subjectTypes,
        weekdays,
        apProfiles,
      };
    }

    return programs;
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

module.exports = initAcademicPortfolio;
