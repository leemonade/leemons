const { groups } = require('../../../table');

module.exports = async function hasGroup(group, { transacting } = {}) {
  const count = await groups.count(
    {
      group,
    },
    { transacting }
  );

  return count > 0;
};
