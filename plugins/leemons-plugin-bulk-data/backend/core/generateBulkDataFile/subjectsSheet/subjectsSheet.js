const { cloneDeep, compact } = require('lodash');
const { SUBJECT_COLUMN_DEFINITIONS, modifyColumnHeaders } = require('./columnDefinitions');
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
        const user = users.find((_user) =>
          _user.userAgents.map((agent) => agent.id).includes(mainTeacher.teacher)
        )?.bulkId;
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
          const user = users.find((_user) =>
            _user.userAgents.map((agent) => agent.id).includes(student)
          )?.bulkId;
          return `${user}@${i + 1}`;
        })
        .join(', ');
    })
  ).join(', ');
}

function getDayClasses(classes, day) {
  return classes.reduce((acc, cls) => {
    const daySchedule = cls.schedule.find((s) => s.day === day);
    if (daySchedule) {
      acc[cls.id] = daySchedule;
    }
    return acc;
  }, {});
}

function getDayScheduleString(dayClasses) {
  return Object.keys(dayClasses)
    .map((classId, i) => `${i + 1}@${dayClasses[classId].start}|${dayClasses[classId].end}`)
    .join(', ');
}

function getTimetableFields(subjectUsesReferenceGroups, classes) {
  const sortedClasses = sortClassesAccordingToReferenceGroups(subjectUsesReferenceGroups, classes);

  const sundayClasses = getDayClasses(sortedClasses, 'sunday');
  const mondayClasses = getDayClasses(sortedClasses, 'monday');
  const tuesdayClasses = getDayClasses(sortedClasses, 'tuesday');
  const wednesdayClasses = getDayClasses(sortedClasses, 'wednesday');
  const thursdayClasses = getDayClasses(sortedClasses, 'thursday');
  const fridayClasses = getDayClasses(sortedClasses, 'friday');
  const saturdayClasses = getDayClasses(sortedClasses, 'saturday');

  const timetable0 = getDayScheduleString(sundayClasses);
  const timetable1 = getDayScheduleString(mondayClasses);
  const timetable2 = getDayScheduleString(tuesdayClasses);
  const timetable3 = getDayScheduleString(wednesdayClasses);
  const timetable4 = getDayScheduleString(thursdayClasses);
  const timetable5 = getDayScheduleString(fridayClasses);
  const timetable6 = getDayScheduleString(saturdayClasses);

  return { timetable0, timetable1, timetable2, timetable3, timetable4, timetable5, timetable6 };
}

// MAIN FUNCTION ···························································································|

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
    modifyColumnHeaders,
  });

  const allSubjectsPromises = programs.map((program) => fetchSubjectsForProgram({ program, ctx }));
  const allSubjectsArrays = await Promise.all(allSubjectsPromises);
  const allSubjects = allSubjectsArrays.flat();

  const allSubjectsDetail = await ctx.call('academic-portfolio.subjects.subjectsByIds', {
    ids: allSubjects.map((subject) => subject.id),
    withClasses: true,
    shouldPrepareAssets: true,
    signedURLExpirationTime: 7 * 24 * 60 * 60, // 7 days
  });

  const subjects = [];
  allSubjectsDetail.forEach((subject, i) => {
    const subjectUsesReferenceGroups = subject.classes.every((cls) => cls.groups);
    const bulkId = `subject${(i + 1).toString().padStart(2, '0')}`;
    const timetableFields = getTimetableFields(subjectUsesReferenceGroups, subject.classes);

    const subjectObject = {
      root: bulkId,
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
      ...timetableFields,
    };
    worksheet.addRow(subjectObject);
    subjects.push({ ...subject, bulkId });
  });

  return subjects;
}

module.exports = { createSubjectsSheet, sortClassesAccordingToReferenceGroups };
