const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const moment = require('moment');
const { verifyJWTToken } = require('./jwt/verifyJWTToken');
const constants = require('../../config/constants');

async function getRegisterPasswordConfig({ token, ctx }) {
  const payload = await verifyJWTToken({ token, ctx });
  const user = await ctx.tx.db.Users.findOne({ id: payload.id }).lean();
  if (!user) throw new LeemonsError(ctx, { message: 'Email not found', httpStatusCode: 401 });

  const recovery = await ctx.tx.db.UserRegisterPassword.findOne({
    user: user.id,
    code: payload.code,
  }).lean();
  if (!recovery)
    throw new LeemonsError(ctx, { message: 'Credentials do not match', httpStatusCode: 401 });

  const now = moment(_.now());
  const updatedAt = moment(recovery.updated_at);
  if (now.diff(updatedAt, 'days') > constants.daysForRegisterPassword)
    throw new LeemonsError(ctx, { message: 'Credentials do not match', httpStatusCode: 401 });

  return { user, recoveryId: recovery.id };
}

module.exports = { getRegisterPasswordConfig };
