const _ = require('lodash');
const moment = require('moment');
const { table } = require('../tables');
const { verifyJWTToken } = require('./jwt/verifyJWTToken');
const constants = require('../../../config/constants');

/**
 * Return reset config
 * @public
 * @static
 * @param {string} token - User token
 * @return {Promise<Object<{user: User, recoveryId: string}>>} Updated user
 * */
async function getResetConfig(token) {
  const payload = await verifyJWTToken(token);
  const user = await table.users.findOne({ id: payload.id });
  if (!user) throw new global.utils.HttpError(401, 'Email not found');

  const recovery = await table.userRecoverPassword.findOne({ user: user.id, code: payload.code });
  if (!recovery) throw new global.utils.HttpError(401, 'Credentials do not match');

  const now = moment(_.now());
  const updatedAt = moment(recovery.updated_at);
  if (now.diff(updatedAt, 'minutes') > constants.timeForRecoverPassword)
    throw new global.utils.HttpError(401, 'Credentials do not match');

  return { user, recoveryId: recovery.id };
}

module.exports = { getResetConfig };
