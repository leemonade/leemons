const { teachers: table } = require('../tables');

module.exports = async function addTeachersToAssignableInstance(
  teachers,
  assignableInstanceId,
  { transacting } = {}
) {
  return table.createMany(
    teachers.map(({ teacher, type }) => ({
      assignableInstance: assignableInstanceId,
      teacher,
      type,
    })),
    {
      transacting,
    }
  );
};
