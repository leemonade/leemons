const { teacherInstances } = require('../../table');

module.exports = async function listTeachers(instance, page, size, { transacting } = {}) {
  try {
    const students = await global.utils.paginate(
      teacherInstances,
      page,
      size,
      { id_$null: false, instance },
      { transacting }
    );

    return students;
  } catch (e) {
    throw new Error('Error getting users for instance');
  }
};
