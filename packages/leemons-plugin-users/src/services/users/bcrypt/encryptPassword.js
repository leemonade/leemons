/**
 * Encrypts the passed password by generating a hash.
 * @private
 * @static
 * @param {string} password
 * @return {Promise<string>} Generated hash password
 * */
async function encryptPassword(password) {
  const salt = await global.utils.bcrypt.genSalt(10);
  return global.utils.bcrypt.hash(password, salt);
}

module.exports = { encryptPassword };
