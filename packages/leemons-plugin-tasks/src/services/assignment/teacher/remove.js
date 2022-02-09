const { teacherInstances } = require('../../table');

module.exports = async function removeTeacher(instance, teacher, { transacting } = {}) {
  try {
    const deleted = await teacherInstances.deleteMany(
      {
        instance,
        teacher,
      },
      { transacting }
    );

    return deleted;
  } catch (e) {
    throw new Error('Error unassigning user from instance');
  }
};
