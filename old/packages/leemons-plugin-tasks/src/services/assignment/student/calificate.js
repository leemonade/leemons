const { userInstances } = require('../../table');

module.exports = async function calificate(
  instance,
  user,
  grade,
  teacherFeedback,
  { transacting } = {}
) {
  try {
    return await userInstances.update(
      {
        instance,
        user,
      },
      {
        grade,
        teacherFeedback,
      },
      {
        transacting,
      }
    );
  } catch (e) {
    throw new global.utils.HttpError(500, e.message);
  }
};
