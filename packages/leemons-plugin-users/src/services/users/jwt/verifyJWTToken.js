const { getJWTPrivateKey } = require('./getJWTPrivateKey');

/**
 * Decrypts the jwt token and return his data
 * @public
 * @static
 * @param {string} token
 * @return {any} Payload
 * */
async function verifyJWTToken(token) {
  return global.utils.jwt.verify(token, await getJWTPrivateKey());
}

module.exports = { verifyJWTToken };
