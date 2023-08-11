/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { validateKeyPrefix } = require('../../validations/exists');
const { table } = require('../tables');

async function getUnreadMessages(keys, userAgent, { transacting } = {}) {
  validateKeyPrefix(keys, this.calledFrom);

  const messages = await table.roomMessagesUnRead.find(
    {
      room_$in: _.isArray(keys) ? keys : [keys],
      userAgent,
    },
    { transacting }
  );

  let count = 0;

  _.forEach(messages, (message) => {
    count += message.count;
  });

  return count;
}

module.exports = { getUnreadMessages };
