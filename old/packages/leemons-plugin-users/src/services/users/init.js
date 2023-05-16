const _ = require('lodash');
const { generateJWTPrivateKey } = require('./jwt/generateJWTPrivateKey');

async function init() {
  await generateJWTPrivateKey();
}

module.exports = { init };
