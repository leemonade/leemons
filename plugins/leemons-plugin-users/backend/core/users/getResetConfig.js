const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const moment = require('moment');
const { verifyJWTToken } = require('./jwt/verifyJWTToken');
const constants = require('../../config/constants');

/**
 * Return reset config
 * @public
 * @static
 * @param {string} token - User token
 * @return {Promise<Object<{user: User, recoveryId: string}>>} Updated user
 * */
async function getResetConfig({ token, ctx }) {
  const payload = await verifyJWTToken({ token, ctx });
  const user = await ctx.tx.db.Users.findOne({ id: payload.id }).lean();
  if (!user) throw new LeemonsError(ctx, { message: 'Email not found', httpStatusCode: 401 });

  const recovery = await ctx.tx.db.UserRecoverPassword.findOne({
    user: user.id,
    code: payload.code,
  }).lean();
  if (!recovery)
    throw new LeemonsError(ctx, { message: 'Credentials do not match', httpStatusCode: 401 });

  const now = moment(_.now());
  const updatedAt = moment(recovery.updated_at);
  if (now.diff(updatedAt, 'minutes') > constants.timeForRecoverPassword)
    throw new LeemonsError(ctx, { message: 'Credentials do not match', httpStatusCode: 401 });

  return { user, recoveryId: recovery.id };
}

module.exports = { getResetConfig };
