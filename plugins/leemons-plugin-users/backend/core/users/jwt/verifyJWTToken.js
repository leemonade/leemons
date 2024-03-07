const jwt = require('jsonwebtoken');
const { getJWTPrivateKey } = require('./getJWTPrivateKey');

/**
 * Decrypts the jwt token and return his data
 * @public
 * @static
 * @param {string} token
 * @return {any} Payload
 * */
async function verifyJWTToken({ token, ctx }) {
  return jwt.verify(token, await getJWTPrivateKey({ ctx }));
}

module.exports = { verifyJWTToken };
