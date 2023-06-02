const { getJWTPrivateKey } = require('./getJWTPrivateKey');

/**
 * Generate the jwt token of passed data
 * @public
 * @static
 * @param {object} payload
 * @return {string} JWT Token
 * */
async function generateJWTToken(payload) {
  return global.utils.jwt.sign(payload, await getJWTPrivateKey(), {
    expiresIn: 60 * 60 * 24,
  }); // 1 day
}

module.exports = { generateJWTToken };
