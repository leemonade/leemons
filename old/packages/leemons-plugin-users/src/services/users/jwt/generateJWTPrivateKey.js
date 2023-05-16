const { table } = require('../../tables');

async function generateJWTPrivateKey() {
  const config = await table.config.findOne({ key: 'jwt-private-key' });
  if (!config)
    return table.config.create({
      key: 'jwt-private-key',
      value: global.utils.randomString(),
    });
  return config;
}

module.exports = { generateJWTPrivateKey };
