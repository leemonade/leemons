const _ = require('lodash');
const moment = require('moment');
const { table } = require('../tables');
const constants = require('../../../config/constants');
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
async function recover(email, ctx) {
  const user = await table.users.findOne(
    { email },
    { columns: ['id', 'locale', 'name', 'email', 'active'] }
  );
  if (!user) throw new global.utils.HttpError(401, 'Email not found');
  if (!user.active) {
    await setUserForRegisterPassword(user.id);
    await sendWelcomeEmailToUser(user, ctx);
    throw new global.utils.HttpErrorWithCustomCode(400, 1001, 'User not active');
  }
  let recovery = await table.userRecoverPassword.findOne({ user: user.id });
  if (recovery) {
    const now = moment(_.now());
    const updatedAt = moment(recovery.updated_at);
    if (now.diff(updatedAt, 'minutes') >= constants.timeForRecoverPassword) {
      recovery = await table.userRecoverPassword.update(
        { id: recovery.id },
        { code: global.utils.randomString(12) }
      );
    }
  } else {
    recovery = await table.userRecoverPassword.create({
      user: user.id,
      code: global.utils.randomString(12),
    });
  }
  if (leemons.getPlugin('emails')) {
    const hostname = await getHostname();
    await leemons
      .getPlugin('emails')
      .services.email.sendAsEducationalCenter(email, 'user-recover-password', user.locale, {
        name: user.name,
        resetUrl: `${hostname || ctx.request.header.origin}/users/reset?token=${encodeURIComponent(
          await generateJWTToken({
            id: user.id,
            code: recovery.code,
          })
        )}`,
        recoverUrl: `${hostname || ctx.request.header.origin}/users/recover`,
      });
  }
  return undefined;
}

module.exports = { recover };
