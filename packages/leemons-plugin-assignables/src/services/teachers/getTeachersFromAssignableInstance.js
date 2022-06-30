const { teachers: table } = require('../tables');

module.exports = async function getTeachersFromAssignableInstance(
  assignableInstanceId,
  { transacting }
) {
  const teachers = await table.find(
    {
      assignableInstance: assignableInstanceId,
    },
    { transacting, columns: ['teacher', 'type'] }
  );

  return teachers;
};
