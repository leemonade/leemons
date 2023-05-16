const { teacherInstances } = require('../../table');

module.exports = async function assignTeacher(instance, teacher, { transacting } = {}) {
  const teachers = Array.isArray(teacher) ? teacher : [teacher];
  try {
    await teacherInstances.createMany(
      teachers.map((t) => ({
        instance,
        teacher: t,
      })),
      { transacting }
    );
  } catch (e) {
    throw new Error('Error assigning teacher to instance');
  }
};
