const { table } = require('../tables');

async function setContactEmail(email, { transacting } = {}) {
  return table.config.set(
    { key: 'platform-contact-email' },
    {
      key: 'platform-contact-email',
      value: email,
    },
    { transacting }
  );
}

module.exports = setContactEmail;
