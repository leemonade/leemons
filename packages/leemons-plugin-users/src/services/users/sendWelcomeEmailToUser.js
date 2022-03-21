const _ = require('lodash');
const { generateJWTToken } = require('./jwt/generateJWTToken');
const { table } = require('../tables');
const constants = require('../../../config/constants');

async function sendWelcomeEmailToUser(user, ctx, { transacting } = {}) {
  const recovery = await table.userRegisterPassword.findOne({ user: user.id }, { transacting });

  return leemons
    .getPlugin('emails')
    .services.email.sendAsPlatform(user.email, 'user-welcome', user.locale, {
      name: user.name,
      url: `${ctx.request.header.origin}/users/register-password?token=${encodeURIComponent(
        await generateJWTToken({
          id: user.id,
          code: recovery.code,
        })
      )}`,
      expDays: constants.daysForRegisterPassword,
    });
}

module.exports = { sendWelcomeEmailToUser };
