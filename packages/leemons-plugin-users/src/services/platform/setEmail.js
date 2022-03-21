const { table } = require('../tables');

/**
 * Set default email por platform
 * @public
 * @static
 * @param {string} email - Email
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function setEmail(email, { transacting } = {}) {
  return table.config.set(
    { key: 'platform-email' },
    {
      key: 'platform-email',
      value: email,
    },
    { transacting }
  );
}

module.exports = setEmail;
