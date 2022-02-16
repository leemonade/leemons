const { userInstances } = require('../../table');

module.exports = async function assignStudent(
  instance,
  user,
  { type = 'direct', transacting } = {}
) {
  const users = Array.isArray(user) ? user : [user];

  try {
    await userInstances.createMany(
      users.map((u) => ({
        instance,
        user: u,
        type,
      })),
      { transacting }
    );
  } catch (e) {
    throw new Error('Error assigning users to instance');
  }
};
