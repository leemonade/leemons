const { userInstances } = require('../../table');

module.exports = async function countUsers(instance, { transacting } = {}) {
  try {
    const count = await userInstances.count({ instance }, { transacting });

    return count;
  } catch (e) {
    throw new Error('Error getting user count for instance');
  }
};
