const { omit } = require('lodash');
const { booleanToYesNoAnswer, configureSheetColumns } = require('../helpers');
const { PROGRAM_COLUMN_DEFINITIONS } = require('./columnDefinitions');
const { ADMIN_BULK_ID } = require('../config/constants');

// HELPERS ················································································································|

const getCreditsPerCourseString = (courses) =>
  courses
    .map(
      (course) =>
        `${course.index}:${course.metadata.minCredits ?? '0'}|${course.metadata.maxCredits ?? '0'}`
    )
    .join(', ');

const getSeatsPerCourseString = (program) => {
  if (!program.groups.length) return undefined;
  if (program.seatsForAllCourses) return program.seatsForAllCourses;
  const { courses } = program;
  return courses.map((course) => `${course.index}:${course.metadata.seats}`).join(', ');
};

const getCyclesString = (cycles, courses) => {
  const sortedCycles = cycles.sort((a, b) => a.index - b.index);

  return sortedCycles
    .map((cycle) => {
      const cycleCourses = cycle.courses
        .map((courseId) => courses.find((course) => course.id === courseId).index)
        .join('|');
      return `${cycle.name}@${cycleCourses}`;
    })
    .join(',\n');
};

const getSubstagesString = (substages) =>
  substages.map((substage) => `${substage.name}|${substage.abbreviation}`).join(', ');

const getGroupsPerCourseString = (groupsMetadata, programAmountOfCourses) => {
  const { groupsForAllCourses } = groupsMetadata;
  if (groupsForAllCourses) {
    return programAmountOfCourses === 1
      ? groupsForAllCourses
      : [new Array(programAmountOfCourses).fill(groupsForAllCourses)]
          .map((amount, index) => `${index + 1}:${amount}`)
          .join(', ');
  }
  const groupsPerCourse = omit(groupsMetadata, [
    'customNameFormat',
    'digits',
    'nameFormat',
    'prefix',
  ]);
  return Object.keys(groupsPerCourse)
    .map((key) => {
      const courseIndex = key.replace('groupsForCourse', '');
      return `${courseIndex}:${groupsPerCourse[key]}`;
    })
    .join(', ');
};

const solveReferenceGroupsFields = (program) => {
  const programHasReferenceGroups = program.groups?.length;
  if (!programHasReferenceGroups) return { referenceGroups: 'No' };
  return {
    referenceGroups: 'Yes',
    groupsPerCourse: program.groups?.length
      ? getGroupsPerCourseString(program.groupsMetadata, program.courses.length)
      : undefined,
    nameFormat: program.groupsMetadata?.customNameFormat ?? program.groupsMetadata.nameFormat,
    digits: program.groupsMetadata.digits ?? undefined,
    prefix: program.groupsMetadata.prefix ?? undefined,
  };
};

// MAIN FUNCTION ····················································································································|

async function createProgramsSheet({ workbook, centers, evaluationSystems, ctx }) {
  const worksheet = workbook.addWorksheet('ap_programs');
  configureSheetColumns({
    worksheet,
    withGroupedTitles: true,
    columnDefinitions: PROGRAM_COLUMN_DEFINITIONS,
  });

  const programsData = await ctx.call('academic-portfolio.programs.programsByCenters', {
    centerIds: centers.map((center) => center.id),
    shouldPrepareAssets: true,
    signedURLExpirationTime: 7 * 24 * 60 * 60, // 7 days
  });

  const programs = [];

  let wrapCount = 0;
  programsData?.forEach((program, i) => {
    if (i > 0 && i % 26 === 0) wrapCount++;
    const suffix = wrapCount > 0 ? wrapCount : '';
    const bulkId = `program${String.fromCharCode(65 + (i % 26))}${suffix}`;
    const programObject = {
      root: bulkId,
      name: program.name,
      abbreviation: program.abbreviation,
      color: program.color,
      image: program.image.cover ?? '',
      centers: centers.find((center) => center.id === program.centers[0]).bulkId,
      evaluationSystem: evaluationSystems.find((system) => system.id === program.evaluationSystem)
        .bulkId,
      creator: ADMIN_BULK_ID,
      creditSystem: booleanToYesNoAnswer(program.credits ?? false),
      credits: program.credits ?? undefined,
      hoursPerCredit: program.hoursPerCredit ?? undefined,
      totalHours: !program.credits ? program.totalHours : undefined,
      maxNumberOfCourses: program.maxNumberOfCourses,
      coursesOffset: 0,
      courseCredits: program.credits ? getCreditsPerCourseString(program.courses) : undefined,
      sequentialCourses: booleanToYesNoAnswer(program.sequentialCourses),
      seatsPerCourse: getSeatsPerCourseString(program),
      cycles: program.cycles?.length ? getCyclesString(program.cycles, program.courses) : undefined,
      substages: program.substages?.length ? getSubstagesString(program.substages) : undefined,
      haveKnowledge: booleanToYesNoAnswer(program.hasKnowledgeAreas),
      hasSubjectTypes: booleanToYesNoAnswer(program.hasSubjectTypes),
      hideStudentsToStudents: booleanToYesNoAnswer(program.hideStudentsToStudents),
      useAutoAssignment: booleanToYesNoAnswer(program.useAutoAssignment),
      useCustomSubjectIds: booleanToYesNoAnswer(program.useCustomSubjectIds),
      ...solveReferenceGroupsFields(program),
    };
    worksheet.addRow(programObject);
    programs.push({ ...program, bulkId, centerBulkId: programObject.centers });
  });

  return programs;
}

module.exports = { createProgramsSheet };
