const { table } = require('../tables');

async function setContactName(name, { transacting } = {}) {
  return table.config.set(
    { key: 'platform-contact-name' },
    {
      key: 'platform-contact-name',
      value: name,
    },
    { transacting }
  );
}

module.exports = setContactName;
