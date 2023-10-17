/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { validateKeyPrefix } = require('../../validations/exists');

async function getUnreadMessages({ keys, userAgent, ctx }) {
  validateKeyPrefix({ key: keys, calledFrom: ctx.callerPlugin, ctx });

  const messages = await ctx.tx.db.RoomMessagesUnRead.find({
    room: _.isArray(keys) ? keys : [keys],
    userAgent,
  });

  let count = 0;

  _.forEach(messages, (message) => {
    count += message.count;
  });

  return count;
}

module.exports = { getUnreadMessages };
