const { LeemonsError } = require('@leemons/error');
const { escapeRegExp } = require('lodash');

const { getProvider } = require('../providers/getProvider');

const { isSuperAdmin } = require('./isSuperAdmin');
const { generateJWTToken } = require('./jwt/generateJWTToken');

/**
 *
 * @param {object} props
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 */
async function verifyIsCallingFromProvider({ ctx }) {
  const provider = await getProvider({ ctx });

  if (ctx.callerPlugin !== provider.pluginName) {
    throw new LeemonsError(ctx, {
      message: 'You are not authorized to call this endpoint',
      httpStatusCode: 403,
      customCode: 'UNAUTHORIZED',
    });
  }

  return true;
}

/**
 *
 * @param {object} props
 * @param {string} props.email
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 */
async function loginWithProvider({ email, ctx }) {
  await verifyIsCallingFromProvider({ ctx });

  const user = await ctx.tx.db.Users.findOne({
    email: new RegExp(`^${escapeRegExp(email)}$`, 'i'),
  }).lean();

  const [token, userAgents] = await Promise.all([
    generateJWTToken({
      payload: { id: user.id },
      ctx,
    }),
    ctx.tx.db.UserAgent.find({
      user: user.id,
      $or: [{ disabled: null }, { disabled: false }],
    })
      .select(['id'])
      .lean(),
  ]);

  if (user && user.id) {
    user.isSuperAdmin = await isSuperAdmin({ userId: user.id, ctx });
    if (!userAgents.length && user.isSuperAdmin) {
      throw new LeemonsError(ctx, { message: 'No user agents to connect', httpStatusCode: 401 });
    }
  }

  return { user, token };
}

module.exports = { loginWithProvider };
