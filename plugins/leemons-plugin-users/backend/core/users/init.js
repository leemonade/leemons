const { generateJWTPrivateKey } = require('./jwt/generateJWTPrivateKey');

async function init({ ctx }) {
  await generateJWTPrivateKey({ ctx });
}

module.exports = { init };
