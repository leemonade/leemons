const { teacherInstances } = require('../../table');

module.exports = async function assignTeacher(instance, teacher, { transacting } = {}) {
  try {
    await teacherInstances.create(
      {
        instance,
        teacher,
      },
      { transacting }
    );
  } catch (e) {
    throw new Error('Error assigning teacher to instance');
  }
};
