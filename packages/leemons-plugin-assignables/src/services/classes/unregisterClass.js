const { classes } = require('../tables');

module.exports = function unregisterClass(assignableInstanceId, classId, { transacting } = {}) {
  const classIds = Array.isArray(classId) ? classId : [classId].filter((id) => id);

  // TODO: Check if user has edition permissions

  return classes.deleteMany(
    {
      assignableInstance: assignableInstanceId,
      class_$in: classIds,
    },
    { transacting }
  );
};
