const { groups } = require('../../../table');
const has = require('./has');

module.exports = async function addGroup(group, type, subject, { transacting } = {}) {
  if (await has(group, { transacting })) {
    return false;
  }

  return groups.create(
    {
      group,
      type,
      subject,
    },
    { transacting }
  );
};
