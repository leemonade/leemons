/**
 * Sets the invited teachers of a class. No permissions are created for invited teachers.
 *
 * @param {Object} params - The parameters for the function.
 * @param {String} params.classId - The id of the class.
 * @param {Array<String>} params.teacherIds - An array of userAgentIds of the teachers to be invited.
 * @param {Context} params.ctx - The moleculer context.
 *
 * @returns {Promise} A promise that resolves to the results of the operations.
 */

async function setInvitedTeachers({ classId, teacherIds, ctx }) {
  await ctx.tx.db.ClassTeacher.deleteMany({
    class: classId,
    type: 'invited-teacher',
  });

  const teachersToCreate = teacherIds.map((teacher) => ({
    class: classId,
    teacher,
    type: 'invited-teacher',
  }));

  const createdTeachers = await ctx.tx.db.ClassTeacher.insertMany(teachersToCreate);

  return {
    classId,
    relationships: createdTeachers,
  };
}

module.exports = { setInvitedTeachers };
