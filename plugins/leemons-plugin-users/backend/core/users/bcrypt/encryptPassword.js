/**
 * Encrypts the passed password by generating a hash.
 * @private
 * @static
 * @param {string} password
 * @return {Promise<string>} Generated hash password
 * */

const { genSalt, hash } = require('bcrypt');

async function encryptPassword(password) {
  const salt = await genSalt(10);
  return hash(password, salt);
}

module.exports = { encryptPassword };
