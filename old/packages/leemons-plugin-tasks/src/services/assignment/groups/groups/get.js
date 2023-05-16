const { groups: table } = require('../../../table');

module.exports = async function getGroup(group, { transacting } = {}) {
  const groups = Array.isArray(group) ? group : [group];
  return table.find(
    {
      group_$in: groups,
    },
    { transacting }
  );
};
