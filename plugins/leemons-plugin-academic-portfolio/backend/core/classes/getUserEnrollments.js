const { filterProgramsByCenter } = require('../programs');
const { getUserProgramIds } = require('../programs/getUserProgramIds');

async function fetchSubjectsAndClassrooms({ programIds, userAgentIds, ctx }) {
  const enrollments = await Promise.all(
    programIds.map(async (programId) => {
      const subjects = await ctx.tx.db.Subjects.find({ program: programId }).lean();
      return Promise.all(
        subjects.map(async (subject) => {
          const classrooms = await ctx.tx.db.Class.find({ subject: subject.id }).lean();
          return Promise.all(
            classrooms.map(async (classroom) => {
              const isStudent = await ctx.tx.db.ClassStudent.findOne({
                class: classroom.id,
                student: userAgentIds,
              }).lean();
              const isTeacher = await ctx.tx.db.ClassTeacher.findOne({
                class: classroom.id,
                teacher: userAgentIds,
              }).lean();

              let enrollmentType = 'none';
              if (isStudent) {
                enrollmentType = 'student';
              } else if (isTeacher) {
                enrollmentType = 'teacher';
              }

              return {
                programId,
                subject,
                classroom,
                enrollmentType,
              };
            })
          );
        })
      ).then((results) => results.flat());
    })
  ).then((results) => results.flat());
  return enrollments.flat();
}

function structureResponse(enrollments) {
  const structured = {};

  enrollments.forEach(({ programId, subject, classroom, enrollmentType }) => {
    if (!structured[programId]) {
      structured[programId] = { subjects: {} };
    }

    if (!structured[programId].subjects[subject.id]) {
      structured[programId].subjects[subject.id] = { classrooms: [] };
    }

    structured[programId].subjects[subject.id].classrooms.push({
      ...classroom,
      enrollmentType,
    });
  });

  return structured;
}
/**
 * Retrieves enrollments for a user based on their userAgentIds and centerId. Optionally, if a contactUserAgentId is provided,
 * it fetches the intersection of enrollments between the user and the contact, showing only the programs and classes they share.
 * The function returns a structured response that organizes programs, subjects, and classrooms hierarchically, including the enrollment type
 * (student or teacher) for each class.
 *
 * @param {Object} params - The parameters for fetching user enrollments.
 * @param {Array<string>} params.userAgentIds - An array of userAgentIds for the user.
 * @param {string} params.centerId - The centerId to filter the programs by.
 * @param {string} [params.contactUserAgentId=''] - An optional userAgentId for a contact to find shared enrollments.
 * @param {Object} params.ctx - The context object containing the database connection and other contextual information.
 * @returns {Promise<Object>} A promise that resolves to an object structured as Program -> Subject -> Classroom, including enrollment types.
 */
async function getUserEnrollments({ userAgentIds, centerId, contactUserAgentId = '', ctx }) {
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

  return structureResponse(userEnrollments);
}

module.exports = { getUserEnrollments };
