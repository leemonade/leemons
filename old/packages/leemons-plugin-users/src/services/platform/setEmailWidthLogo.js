const { table } = require('../tables');

async function setEmailWidthLogo(width, { transacting } = {}) {
  return table.config.set(
    { key: 'platform-email-width-logo' },
    {
      key: 'platform-email-width-logo',
      value: width,
    },
    { transacting }
  );
}

module.exports = setEmailWidthLogo;
