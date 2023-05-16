const { table } = require('../tables');

async function setLandscapeLogo(logo, { transacting } = {}) {
  return table.config.set(
    { key: 'platform-landscape-logo' },
    {
      key: 'platform-landscape-logo',
      value: logo,
    },
    { transacting }
  );
}

module.exports = setLandscapeLogo;
