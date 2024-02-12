const jwt = require('jsonwebtoken');
const { getJWTPrivateKey } = require('./getJWTPrivateKey');

/**
 * Generate the jwt token of passed data
 * @public
 * @static
 * @param {object} payload
 * @return {Promise<string>} JWT Token
 * */
async function generateJWTToken({ payload, ctx }) {
  const token = await getJWTPrivateKey({ ctx });
  return jwt.sign(payload, token, {
    expiresIn: 60 * 60 * 24,
  }); // 1 day
}

module.exports = { generateJWTToken };
