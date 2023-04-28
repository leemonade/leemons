/**
 * Returns the user if there is one with that email and the password matched.
 * @public
 * @static
 * @param {string} email - User email
 * @param {string} password - User password in raw
 * @return {Promise<User>} Created / Updated role
 * */
const { generateJWTToken } = require('./jwt/generateJWTToken');
const { comparePassword } = require('./bcrypt/comparePassword');
const { table } = require('../tables');
const { isSuperAdmin } = require('./isSuperAdmin');

async function login(email, password) {
  const userP = await table.users.findOne({ email, active: true }, { columns: ['id', 'password'] });
  if (!userP) throw new global.utils.HttpError(401, 'Credentials do not match');

  const userAgents = await table.userAgent.find(
    { user: userP.id, $or: [{ disabled_$null: true }, { disabled: false }] },
    { columns: ['id'] }
  );

  const areEquals = await comparePassword(password, userP.password);
  if (!areEquals) throw new global.utils.HttpError(401, 'Credentials do not match');

  const [user, token] = await Promise.all([
    table.users.findOne({ email }),
    generateJWTToken({ id: userP.id }),
  ]);

  if (user && user.id) {
    user.isSuperAdmin = await isSuperAdmin(user.id);
    if (!userAgents.length && user.isSuperAdmin) {
      throw new global.utils.HttpError(401, 'No user agents to connect');
    }
  }

  return { user, token };
}

module.exports = { login };
