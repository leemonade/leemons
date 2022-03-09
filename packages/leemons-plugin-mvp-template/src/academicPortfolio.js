/* eslint-disable no-unreachable */
/* eslint-disable no-await-in-loop */
const { keys, find, flattenDeep, uniq } = require('lodash');
const importProfiles = require('./bulk/academic-portfolio/profiles');
const importPrograms = require('./bulk/academic-portfolio/programs');
const importSubjectTypes = require('./bulk/academic-portfolio/subjectTypes');
const importKnowledgeAreas = require('./bulk/academic-portfolio/knowledgeAreas');
const importSubjects = require('./bulk/academic-portfolio/subjects');

async function initAcademicPortfolio({ centers, profiles, users }) {
  const { services } = leemons.getPlugin('academic-portfolio');

  try {
    // ·····················································
    // SETTINGS

    let apProfiles = await importProfiles(profiles);
    apProfiles = await services.settings.setProfiles(apProfiles);

    // ·····················································
    // PROGRAMS

    const programs = await importPrograms(centers);
    const programsKeys = keys(programs);

    for (let i = 0, len = programsKeys.length; i < len; i++) {
      const program = programs[programsKeys[i]];
      const programData = await services.programs.addProgram(program);
      programs[programsKeys[i]] = { ...programData };
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
      const { classes, ...subject } = subjects[key];
      const subjectData = await services.subjects.addSubject(subject);
      subjects[key] = { ...subjectData };

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
        const { program, teachers, ...rest } = classes[j];
        const programData = find(programs, { id: program });
        const [center] = programData.centers;

        const teachersData = await Promise.all(
          teachers.map(({ teacher }) =>
            leemons
              .getPlugin('users')
              .services.users.getUserAgentByCenterProfile(teacher, center, apProfiles.teacher)
          )
        );

        const classroom = {
          ...rest,
          program,
          subject: subjectData.id,
          group: groupsData[j].id,
          teachers: teachersData.map((teacherData) => {
            const teacher = find(teachers, { teacher: teacherData.user });
            return { teacher: teacherData.id, type: teacher.type };
          }),
        };

        console.dir(classroom, { depth: null });

        classesData.push(await services.classes.addClass(classroom));
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
