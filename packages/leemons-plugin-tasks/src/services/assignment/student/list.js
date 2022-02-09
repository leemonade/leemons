const { userInstances } = require('../../table');

module.exports = async function listUsers(instance, page, size, { transacting } = {}) {
  try {
    const students = await global.utils.paginate(
      userInstances,
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
