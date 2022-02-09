const { userInstances } = require('../../table');

module.exports = async function assignStudent(
  instance,
  user,
  { type = 'direct', transacting } = {}
) {
  try {
    await userInstances.create(
      {
        instance,
        user,
        type,
      },
      { transacting }
    );
  } catch (e) {
    throw new Error('Error assigning user to instance');
  }
};
