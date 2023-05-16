const { groupsInstances } = require('../../table');

module.exports = async function getGroups(instance, { transacting } = {}) {
  const groups = await groupsInstances.find(
    {
      instance,
    },
    { columns: ['instance', 'group'], transacting }
  );

  return groups.map((g) => g.group);
};
