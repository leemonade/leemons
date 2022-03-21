const _ = require('lodash');
const moment = require('moment');
const { table } = require('../tables');
const { verifyJWTToken } = require('./jwt/verifyJWTToken');
const constants = require('../../../config/constants');

async function getRegisterPasswordConfig(token) {
  const payload = await verifyJWTToken(token);
  const user = await table.users.findOne({ id: payload.id });
  if (!user) throw new global.utils.HttpError(401, 'Email not found');

  const recovery = await table.userRegisterPassword.findOne({ user: user.id, code: payload.code });
  if (!recovery) throw new global.utils.HttpError(401, 'Credentials do not match');

  const now = moment(_.now());
  const updatedAt = moment(recovery.updated_at);
  if (now.diff(updatedAt, 'days') > constants.daysForRegisterPassword)
    throw new global.utils.HttpError(401, 'Credentials do not match');

  return { user, recoveryId: recovery.id };
}

module.exports = { getRegisterPasswordConfig };
