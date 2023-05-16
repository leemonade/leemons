const { table } = require('../tables');

async function setSquareLogo(logo, { transacting } = {}) {
  return table.config.set(
    { key: 'platform-square-logo' },
    {
      key: 'platform-square-logo',
      value: logo,
    },
    { transacting }
  );
}

module.exports = setSquareLogo;
