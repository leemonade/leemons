const { groupsInstances } = require('../../table');

module.exports = async function hasGroup(instance, group, student, { transacting } = {}) {
  const count = await groupsInstances.count(
    {
      instance,
      group,
      student,
    },
    { transacting }
  );

  return count > 0;
};
