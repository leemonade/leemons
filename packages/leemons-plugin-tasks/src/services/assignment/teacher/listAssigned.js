const { teacherInstances } = require('../../table');

module.exports = async function listAssigned(userAgent, page, size, { transacting } = {}) {
  try {
    const students = await global.utils.paginate(
      teacherInstances,
      page,
      size,
      { id_$null: false, teacher: userAgent },
      { transacting }
    );

    return students;
  } catch (e) {
    throw new Error('Error getting teacher instances');
  }
};
