/**
 * Returns the user if there is one with that email and the password matched.
 * @public
 * @static
 * @param {string} email - User email
 * @param {string} password - User password in raw
 * @return {Promise<User>} Created / Updated role
 * */

const { LeemonsError } = require('leemons-error');
const { generateJWTToken } = require('./jwt/generateJWTToken');
const { comparePassword } = require('./bcrypt/comparePassword');

const { isSuperAdmin } = require('./isSuperAdmin');

async function login({ email, password, ctx }) {
  const userP = await ctx.tx.db.Users.findOne({ email, active: true })
    .select(['id', 'password'])
    .lean();
  if (!userP)
    throw new LeemonsError(ctx, { message: 'Credentials do not match', httpStatusCode: 401 });

  const userAgents = await ctx.tx.db.UserAgent.find({
    user: userP.id,
    $or: [{ disabled: null }, { disabled: false }],
  })
    .select(['id'])
    .lean();

  const areEquals = await comparePassword(password, userP.password);
  if (!areEquals)
    throw new LeemonsError(ctx, { message: 'Credentials do not match', httpStatusCode: 401 });

  const [user, token] = await Promise.all([
    ctx.tx.db.Users.findOne({ email }).lean(),
    generateJWTToken({ payload: { id: userP.id }, ctx }),
  ]);

  if (user && user.id) {
    user.isSuperAdmin = await isSuperAdmin({ userId: user.id, ctx });
    if (!userAgents.length && user.isSuperAdmin) {
      throw new LeemonsError(ctx, { message: 'No user agents to connect', httpStatusCode: 401 });
    }
  }

  return { user, token };
}

module.exports = { login };
