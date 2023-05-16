const _ = require('lodash');
const moment = require('moment');
const { table } = require('../tables');
const constants = require('../../../config/constants');

async function setUserForRegisterPassword(userId, { transacting } = {}) {
  let recovery = await table.userRegisterPassword.findOne({ user: userId }, { transacting });
  if (recovery) {
    const now = moment(_.now());
    const updatedAt = moment(recovery.updated_at);
    if (now.diff(updatedAt, 'days') >= constants.daysForRegisterPassword) {
      recovery = await table.userRegisterPassword.update(
        { id: recovery.id },
        { code: global.utils.randomString(6) },
        { transacting }
      );
    }
  } else {
    recovery = await table.userRegisterPassword.create(
      {
        user: userId,
        code: global.utils.randomString(6),
      },
      { transacting }
    );
  }
  return recovery;
}

module.exports = { setUserForRegisterPassword };
