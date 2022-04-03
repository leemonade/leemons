const { userInstances } = require('../../table');

module.exports = async function getCalification(instance, user, { transacting } = {}) {
  try {
    return await userInstances.findOne(
      {
        instance,
        user,
      },
      {
        columns: ['grade', 'teacherFeedback'],
        transacting,
      }
    );
  } catch (e) {
    throw new global.utils.HttpError(500, e.message);
  }
};
