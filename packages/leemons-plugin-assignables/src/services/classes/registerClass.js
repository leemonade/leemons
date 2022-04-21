const { classes } = require('../tables');

module.exports = async function registerClass(
  assignableInstanceId,
  assignable,
  classId,
  { transacting }
) {
  const classIds = Array.isArray(classId) ? classId : [classId].filter((id) => id);

  // TODO: Check if class exists

  const now = global.utils.sqlDatetime(new Date());
  // EN: Register the class
  // ES: Registrar la clase
  await classes.createMany(
    classIds.map((id) => ({
      assignableInstance: assignableInstanceId,
      assignable,
      class: id,
      date: now,
    })),
    { transacting }
  );

  return {
    assignableInstance: assignableInstanceId,
    assignable,
    classes: classIds,
    date: new Date(now),
  };
};
