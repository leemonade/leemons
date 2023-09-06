const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { randomString } = require('leemons-utils');
const moment = require('moment');
const constants = require('../../config/constants');
const { generateJWTToken } = require('./jwt/generateJWTToken');
const getHostname = require('../platform/getHostname');
const { setUserForRegisterPassword } = require('./setUserForRegisterPassword');
const { sendWelcomeEmailToUser } = require('./sendWelcomeEmailToUser');

/**
 * If there is a user with that email we check if there is already a recovery in progress, if
 * there is we resend the email with the previously generated code, if there is no recovery in
 * progress we update an existing expired one or create a new one.
 * @public
 * @static
 * @param {string} email - User email
 * @param {any} ctx - Next context
 * @return {Promise<undefined>}
 * */
async function recover({ email, ctx }) {
  const user = await ctx.tx.db.Users.findOne({ email })
    .select(['id', 'locale', 'name', 'email', 'active'])
    .lean();
  if (!user) throw new LeemonsError(ctx, { message: 'Email not found', httpStatusCode: 401 });

  if (!user.active) {
    await setUserForRegisterPassword({ userId: user.id, ctx });
    await sendWelcomeEmailToUser({ user, ctx });
    throw new LeemonsError(ctx, {
      message: 'User not active',
      httpStatusCode: 400,
      customCode: 1001,
    });
  }
  let recovery = await ctx.tx.db.UserRecoverPassword.findOne({ user: user.id }).lean();
  if (recovery) {
    const now = moment(_.now());
    const updatedAt = moment(recovery.updated_at);
    if (now.diff(updatedAt, 'minutes') >= constants.timeForRecoverPassword) {
      recovery = await ctx.tx.db.UserRecoverPassword.findOneAndUpdate(
        { id: recovery.id },
        { code: randomString(12) },
        { new: true, lean: true }
      );
    }
  } else {
    recovery = await ctx.tx.db.UserRecoverPassword.create({
      user: user.id,
      code: randomString(12),
    });
    recovery = recovery.toObject();
  }
  if (leemons.getPlugin('emails')) {
    const hostname = await getHostname({ ctx });

    await ctx.tx.call('emails.email.sendAsEducationalCenter', {
      to: email,
      templateName: 'user-recover-password',
      language: user.locale,
      context: {
        name: user.name,
        resetUrl: `${hostname}/users/reset?token=${encodeURIComponent(
          await generateJWTToken({
            payload: {
              id: user.id,
              code: recovery.code,
            },
            ctx,
          })
        )}`,
        recoverUrl: `${hostname}/users/recover`,
      },
    });
  }
  return undefined;
}

module.exports = { recover };
