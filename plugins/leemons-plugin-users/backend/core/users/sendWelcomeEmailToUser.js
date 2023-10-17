const { LeemonsError } = require('@leemons/error');
const { generateJWTToken } = require('./jwt/generateJWTToken');
const constants = require('../../config/constants');
const getHostname = require('../platform/getHostname');

async function sendWelcomeEmailToUser({ user, ctx }) {
  const recovery = await ctx.tx.db.UserRegisterPassword.findOne({ user: user.id }).lean();
  const hostname = await getHostname({ ctx });

  if (!recovery) throw new LeemonsError(ctx, { message: 'User is already active' });
  return ctx.tx.call('emails.email.sendAsPlatform', {
    to: user.email,
    templateName: 'user-welcome',
    language: user.locale,
    context: {
      name: user.name,
      url: `${hostname}/users/register-password?token=${encodeURIComponent(
        await generateJWTToken({
          payload: { id: user.id, code: recovery.code },
          ctx,
        })
      )}`,
      expDays: constants.daysForRegisterPassword,
    },
  });
}

module.exports = { sendWelcomeEmailToUser };
