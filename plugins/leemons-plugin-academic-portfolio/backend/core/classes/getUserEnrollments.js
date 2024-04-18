const { omit } = require('lodash');

const { LeemonsError } = require('@leemons/error');
const { filterProgramsByCenter, programsByIds } = require('../programs');
const { getUserProgramIds } = require('../programs/getUserProgramIds');
const { classByIds } = require('./classByIds');
const { subjectByIds } = require('../subjects');

async function fetchSubjectsAndClassrooms({ programIds, userAgentIds, ctx }) {
  const enrollments = await Promise.all(
    programIds.map(async (programId) => {
      const classes = await ctx.tx.db.Class.find({ program: programId }).lean();

      return Promise.all(
        classes.map(async (classroom) => {
          const isStudent = await ctx.tx.db.ClassStudent.findOne({
            class: classroom.id,
            student: userAgentIds,
          }).lean();
          const isTeacher = await ctx.tx.db.ClassTeacher.findOne({
            class: classroom.id,
            teacher: userAgentIds,
          }).lean();

          if (!isStudent && !isTeacher) {
            return null;
          }

          const enrollmentType = isStudent ? 'student' : 'teacher';
          const subject = await ctx.tx.db.Subjects.findOne({ id: classroom.subject }).lean();

          return {
            programId,
            subject,
            classroom,
            enrollmentType,
          };
        })
      );
    })
  );

  return enrollments.flat().filter((enrollment) => enrollment !== null);
}

async function structureResponse({ enrollments, ctx }) {
  const structuredPrograms = [];
  const programsIds = [...new Set(enrollments.map((enrollment) => enrollment.programId))];
  const detailedPrograms = await programsByIds({ ids: programsIds, ctx });
  const subjectIds = [...new Set(enrollments.map((enrollment) => enrollment.subject.id))];
  const detailedSubjects = await subjectByIds({ ids: subjectIds, ctx });
  const classroomsIds = [...new Set(enrollments.map((enrollment) => enrollment.classroom.id))];
  const detailedClasses = await classByIds({ ids: classroomsIds, ctx });

  enrollments.forEach(({ programId, subject, classroom, ...otherInfo }) => {
    let program = structuredPrograms.find((p) => p.id === programId);
    if (!program) {
      program = {
        ...omit(
          detailedPrograms.find((p) => p.id === programId),
          [
            'treeTypeNodes',
            'subjects',
            'maxGroupAbbreviation',
            'maxGroupAbbreviationIsOnlyNumbers',
            'useOneStudentGroup',
            'courseCredits',
            'hideCoursesInTree',
            'moreThanOneAcademicYear',
            'haveSubstagesPerCourse',
            'subjectsFirstDigit',
            'subjectsDigits',
            'treeType',
            'haveKnowledge',
            'maxKnowledgeAbbreviation',
            'maxKnowledgeAbbreviationIsOnlyNumbers',
            'maxSubstageAbbreviationIsOnlyNumbers',
            'customSubstages',
          ]
        ),
        subjects: [],
      };
      structuredPrograms.push(program);
    }

    let subjectEntry = program.subjects.find((s) => s.id === subject.id);
    if (!subjectEntry) {
      subjectEntry = {
        ...omit(
          detailedSubjects.find((s) => s.id === subject.id),
          []
        ),
        classes: [],
      };
      program.subjects.push(subjectEntry);
    }

    const classroomEntry = {
      ...omit(
        detailedClasses.find((c) => c.id === classroom.id),
        'subject'
      ),
      ...otherInfo,
    };
    subjectEntry.classes.push(classroomEntry);
  });

  return structuredPrograms;
}

/**
 * Retrieves user enrollments, including programs with detailed subjects and classes.
 * For each class, it adds information about the user's enrollment type (student or teacher)
 * and, if a contact user agent ID is provided, the enrollment type of the contact in shared classes.
 *
 * @param {Object} params - The parameters for fetching user enrollments.
 * @param {string[]} params.userAgentIds - The user agent IDs for which to fetch enrollments (they must belong to the same user).
 * @param {string} params.centerId - The center ID to filter the programs by.
 * @param {string} [params.contactUserAgentId=''] - Optional. The contact user agent ID to find shared class enrollments.
 * @param {Object} params.ctx - The context object containing database connections and session information.
 * @returns {Promise<Object[]>} A promise that resolves to an array of program objects. Each program object includes
 *                              detailed subjects, and each subject includes detailed classes. Classes contain additional
 *                              properties `enrollmentType` to indicate the user's relation to the class (student or teacher)
 *                              and `sharedWithContactWhereContactIs` (if applicable) to indicate the contact's enrollment type
 *                              in shared classes.
 */
async function getUserEnrollments({ userAgentIds, centerId, contactUserAgentId = '', ctx }) {
  const userInfo = await ctx.tx.call('users.users.getUserAgentsInfo', {
    userAgentIds,
  });
  const userIds = userInfo.map((info) => info.user.id);
  const uniqueUserIds = [...new Set(userIds)];
  if (uniqueUserIds.length > 1) {
    throw new LeemonsError(ctx, { message: 'User agent ids must belong to the same user.' });
  }

  const programIds = await getUserProgramIds({
    ctx: { ...ctx, userSession: { userAgents: [{ id: userAgentIds }] } },
  });

  const filteredProgramIds = await filterProgramsByCenter({ programIds, centerId, ctx });
  let userEnrollments = await fetchSubjectsAndClassrooms({
    programIds: filteredProgramIds,
    userAgentIds,
    ctx,
  });

  if (contactUserAgentId) {
    const contactProgramIds = await getUserProgramIds({
      ctx: { ...ctx, userSession: { userAgents: [{ id: contactUserAgentId }] } },
    });
    const contactFilteredProgramIds = await filterProgramsByCenter({
      programIds: contactProgramIds,
      centerId,
      ctx,
    });
    const contactEnrollments = await fetchSubjectsAndClassrooms({
      programIds: contactFilteredProgramIds,
      userAgentIds: [contactUserAgentId],
      ctx,
    });

    userEnrollments = userEnrollments.map((enrollment) => {
      const sharedEnrollment = contactEnrollments.find(
        (ce) => ce.programId === enrollment.programId && ce.classroom.id === enrollment.classroom.id
      );
      if (sharedEnrollment) {
        return {
          ...enrollment,
          sharedWithContactWhereContactIs: sharedEnrollment.enrollmentType,
        };
      }
      return enrollment;
    });
  }

  return structureResponse({ enrollments: userEnrollments, ctx });
}

module.exports = { getUserEnrollments };
