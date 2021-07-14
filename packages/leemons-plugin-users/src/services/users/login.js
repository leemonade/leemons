/**
 * Returns the user if there is one with that email and the password matched.
 * @public
 * @static
 * @param {string} email - User email
 * @param {string} password - User password in raw
 * @return {Promise<User>} Created / Updated role
 * */
const { generateJWTToken } = require('./generateJWTToken');
const { comparePassword } = require('./comparePassword');
const { table } = require('../tables');

async function login(email, password) {
  const userP = await table.users.findOne({ email, active: true }, { columns: ['id', 'password'] });
  if (!userP) throw new global.utils.HttpError(401, 'Credentials do not match');

  const areEquals = await comparePassword(password, userP.password);
  if (!areEquals) throw new global.utils.HttpError(401, 'Credentials do not match');

  const [user, token] = await Promise.all([
    table.users.findOne({ email }),
    generateJWTToken({ id: userP.id }),
  ]);

  return { user, token };
}

module.exports = { login };
