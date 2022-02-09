const { userInstances } = require('../../table');

module.exports = async function removeStudent(
  instance,
  user,
  { type = 'direct', transacting } = {}
) {
  try {
    const deleted = await userInstances.deleteMany(
      {
        instance,
        user,
        type,
      },
      { transacting }
    );

    return deleted;
  } catch (e) {
    throw new Error('Error unassigning user from instance');
  }
};
