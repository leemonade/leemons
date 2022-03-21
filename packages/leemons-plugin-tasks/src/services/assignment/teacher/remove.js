const { teacherInstances } = require('../../table');

module.exports = async function removeTeacher(instance, teacher, { transacting } = {}) {
  try {
    const query = {
      instance,
    };

    if (teacher) {
      if (Array.isArray(teacher)) {
        query.teacher_$in = teacher;
      } else {
        query.teacher = teacher;
      }
    }
    const deleted = await teacherInstances.deleteMany(query, { transacting });

    return deleted;
  } catch (e) {
    throw new Error('Error unassigning user from instance');
  }
};
