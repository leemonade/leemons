const { generateJWTToken } = require('./jwt/generateJWTToken');
const { table } = require('../tables');
const constants = require('../../../config/constants');
const getHostname = require('../platform/getHostname');

async function sendWelcomeEmailToUser(user, ctx, { transacting } = {}) {
  const recovery = await table.userRegisterPassword.findOne({ user: user.id }, { transacting });
  const hostname = await getHostname();

  if (!recovery) throw new Error('User is already active');
  const email = await leemons
    .getPlugin('emails')
    .services.email.sendAsPlatform(user.email, 'user-welcome', user.locale, {
      name: user.name,
      url: `${
        hostname || ctx.request.header.origin
      }/users/register-password?token=${encodeURIComponent(
        await generateJWTToken({
          id: user.id,
          code: recovery.code,
        })
      )}`,
      expDays: constants.daysForRegisterPassword,
    });

  return email;
}

module.exports = { sendWelcomeEmailToUser };
