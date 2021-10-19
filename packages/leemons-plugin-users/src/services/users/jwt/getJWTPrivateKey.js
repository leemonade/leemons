const { generateJWTPrivateKey } = require('./generateJWTPrivateKey');
const { table } = require('../../tables');

let jwtPrivateKey = null;

async function getJWTPrivateKey() {
  if (!jwtPrivateKey) jwtPrivateKey = await table.config.findOne({ key: 'jwt-private-key' });
  if (!jwtPrivateKey) jwtPrivateKey = await generateJWTPrivateKey();
  return jwtPrivateKey.value;
}

module.exports = { getJWTPrivateKey };
