const { cloneDeep, compact } = require('lodash');
const { SUBJECT_COLUMN_DEFINITIONS } = require('./columnDefinitions');
const { configureSheetColumns } = require('../helpers');

// HELPERS ························································································|

async function fetchSubjectsForProgram({ program, page = 0, allSubjects = [], ctx }) {
  const response = await ctx.call('academic-portfolio.subjects.listSubjectRest', {
    page,
    size: 9999,
    program: program.id,
  });
  const newSubjects = allSubjects.concat(response.data.items);
  if (response.data.nextPage !== 0) {
    return fetchSubjectsForProgram({
      program,
      page: response.data.nextPage,
      allSubjects: newSubjects,
      ctx,
    });
  }
  return newSubjects;
}

function getSubjectSubstage(subject) {
  const { classes } = subject;

  const substageAbbreviation = classes[0].substages[0]?.abbreviation;
  if (classes.every((c) => c.substages[0]?.abbreviation === substageAbbreviation)) {
    return substageAbbreviation;
  }
  return undefined;
}

function sortClassesAccordingToReferenceGroups(subjectUsesReferenceGroups, classes) {
  return cloneDeep(classes).sort((a, b) => {
    const keyA = subjectUsesReferenceGroups ? a.groups.name : a.classWithoutGroupId;
    const keyB = subjectUsesReferenceGroups ? b.groups.name : b.classWithoutGroupId;
    return keyA.localeCompare(keyB);
  });
}

function getClassroomsWithoutGroupInfo(classes) {
  const sortedClasses = sortClassesAccordingToReferenceGroups(false, classes);
  return sortedClasses
    .map((cls, i) => {
      const alias = cls.alias ? `@${cls.alias}` : '';
      return `${i + 1}:${cls.seats}${alias}`;
    })
    .join(', ');
}

function getClassroomsCustomId(subjectUsesReferenceGroups, classes) {
  const sortedClasses = sortClassesAccordingToReferenceGroups(subjectUsesReferenceGroups, classes);
  return compact(
    sortedClasses.map((c, i) => (c.classroomId ? `${i + 1}:${c.classroomId}` : ''))
  ).join(', ');
}

function getTeachersString(subjectUsesReferenceGroups, classes, users) {
  const sortedClasses = sortClassesAccordingToReferenceGroups(subjectUsesReferenceGroups, classes);
  return compact(
    sortedClasses.map((cls, i) => {
      if (!cls.teachers?.length) return '';
      const mainTeacher = cls.teachers.find((teacher) => teacher.type === 'main-teacher');
      if (mainTeacher) {
        const type = 'main';
        const user = users.find((_user) => _user.userAgents.includes(mainTeacher.teacher))?.bulkId;
        return `${user}|${type}@${i + 1}`;
      }
      return '';
    })
  ).join(', ');
}

function getStudentsString(subjectUsesReferenceGroups, classes, users) {
  const sortedClasses = sortClassesAccordingToReferenceGroups(subjectUsesReferenceGroups, classes);
  return compact(
    sortedClasses.map((cls, i) => {
      if (!cls.students?.length) return '';
      return cls.students
        .map((student) => {
          const user = users.find((_user) => _user.userAgents.includes(student)).bulkId;
          return `${user}@${i + 1}`;
        })
        .join(', ');
    })
  ).join(', ');
}

// MAIN ···························································································|

async function createSubjectsSheet({
  workbook,
  programs,
  subjectTypes,
  knowledgeAreas,
  users,
  ctx,
}) {
  const worksheet = workbook.addWorksheet('ap_subjects');
  configureSheetColumns({
    worksheet,
    withGroupedTitles: true,
    columnDefinitions: SUBJECT_COLUMN_DEFINITIONS,
  });

  const allSubjectsPromises = programs.map((program) => fetchSubjectsForProgram({ program, ctx }));
  const allSubjectsArrays = await Promise.all(allSubjectsPromises);
  const allSubjects = allSubjectsArrays.flat();

  const allSubjectsDetail = await ctx.call('academic-portfolio.subjects.subjectsByIds', {
    ids: allSubjects.map((subject) => subject.id),
    withClasses: true,
    shouldPrepareAssets: true,
  });

  const subjects = [];
  allSubjectsDetail.forEach((subject, i) => {
    const subjectUsesReferenceGroups = subject.classes.every((cls) => cls.groups);
    const bulkId = (i + 1).toString().padStart(2, '0');
    const subjectObject = {
      root: `subject${bulkId}`,
      name: subject.name,
      program: programs.find((program) => program.id === subject.program).bulkId,
      creator: 'admin',
      internalId: subject.internalId ?? '',
      color: subject.color,
      image: subject.image.cover,
      icon: subject.icon.cover,
      knowledgeArea: knowledgeAreas.find(
        (knowledgeArea) => knowledgeArea.id === subject.knowledgeArea
      )?.bulkId,
      subjectType: subjectTypes.find((subjectType) => subjectType.id === subject.subjectType)
        ?.bulkId,
      substage: getSubjectSubstage(subject),
      courses: subject.courses.length,
      credits: subject.credits ?? '',
      groupsAmount: subjectUsesReferenceGroups ? subject.classes.length : '',
      classrooms: subjectUsesReferenceGroups ? '' : getClassroomsWithoutGroupInfo(subject.classes),
      classesCustomIds: getClassroomsCustomId(subjectUsesReferenceGroups, subject.classes),
      teachers: getTeachersString(subjectUsesReferenceGroups, subject.classes, users),
      students: getStudentsString(subjectUsesReferenceGroups, subject.classes, users),
    };
    worksheet.addRow(subjectObject);
    subjects.push(subjectObject);
  });

  return subjects;
}

module.exports = { createSubjectsSheet };
