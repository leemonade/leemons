const _ = require('lodash');
const { randomString } = require('leemons-utils');
const moment = require('moment');
const constants = require('../../config/constants');

async function setUserForRegisterPassword({ userId, ctx }) {
  let recovery = await ctx.tx.db.UserRegisterPassword.findOne({ user: userId }).lean();
  if (recovery) {
    const now = moment(_.now());
    const updatedAt = moment(recovery.updated_at);
    if (now.diff(updatedAt, 'days') >= constants.daysForRegisterPassword) {
      recovery = await ctx.tx.db.UserRegisterPassword.findOneAndUpdate(
        { id: recovery.id },
        { code: randomString(6) },
        { new: true }
      );
    }
  } else {
    recovery = await ctx.tx.db.UserRegisterPassword.create({
      user: userId,
      code: randomString(6),
    });
  }
  return recovery;
}

module.exports = { setUserForRegisterPassword };
