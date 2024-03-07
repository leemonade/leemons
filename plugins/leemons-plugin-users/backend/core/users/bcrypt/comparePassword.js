/**
 * Compares a password against a password hash to check if they are equal
 * @private
 * @static
 * @param {string} password
 * @param {string} hashPassword
 * @return {Promise<boolean>} If they are equal, returns true
 * */

const { compare } = require('bcrypt');

function comparePassword(password, hashPassword) {
  return compare(password, hashPassword);
}

module.exports = { comparePassword };
