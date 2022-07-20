const { table } = require('../tables');

async function setName(name, { transacting } = {}) {
  return table.config.set(
    { key: 'platform-name' },
    {
      key: 'platform-name',
      value: name,
    },
    { transacting }
  );
}

module.exports = setName;
