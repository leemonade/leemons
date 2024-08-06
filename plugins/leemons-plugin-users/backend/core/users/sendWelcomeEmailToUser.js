const { LeemonsError } = require('@leemons/error');
const { generateJWTToken } = require('./jwt/generateJWTToken');
const constants = require('../../config/constants');
const getHostname = require('../platform/getHostname');
const hasProvider = require('../providers/hasProvider');

/**
 *
 * @returns {boolean}
 */
async function sendWelcomeEmailToUser({ user, ctx }) {
  const [recovery, hasAProvider] = await Promise.all([
    ctx.tx.db.UserRegisterPassword.findOne({ user: user.id }).lean(),
    hasProvider({ ctx }),
  ]);

  if (hasAProvider) {
    return false;
  }

  const hostname = await getHostname({ ctx });

  if (!recovery) throw new LeemonsError(ctx, { message: 'User is already active' });

  const token = await generateJWTToken({
    payload: { id: user.id, code: recovery.code },
    ctx,
  });

  return ctx.tx.call('emails.email.sendAsPlatform', {
    to: user.email,
    templateName: 'user-welcome',
    language: user.locale,
    context: {
      name: user.name,
      url: `${hostname}/users/register-password?token=${encodeURIComponent(token)}`,
      expDays: constants.daysForRegisterPassword,
    },
  });
}

module.exports = { sendWelcomeEmailToUser };
