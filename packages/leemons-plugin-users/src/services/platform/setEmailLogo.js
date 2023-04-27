const { table } = require('../tables');

async function setEmailLogo(logo, { transacting } = {}) {
  return table.config.set(
    { key: 'platform-email-logo' },
    {
      key: 'platform-email-logo',
      value: logo,
    },
    { transacting }
  );
}

module.exports = setEmailLogo;
