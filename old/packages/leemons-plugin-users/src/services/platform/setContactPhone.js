const { table } = require('../tables');

async function setContactPhone(phone, { transacting } = {}) {
  return table.config.set(
    { key: 'platform-contact-phone' },
    {
      key: 'platform-contact-phone',
      value: phone,
    },
    { transacting }
  );
}

module.exports = setContactPhone;
