/* eslint-disable no-param-reassign */
const { table } = require('../tables');
const { validateKeyPrefix } = require('../../validations/exists');

async function markAsRead(key, userAgentId, { transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);
  const count = await table.roomMessagesUnRead.count(
    {
      room: key,
      userAgent: userAgentId,
    },
    { transacting }
  );
  if (!count) return null;
  await leemons.socket.emit(userAgentId, `COMUNICA:ROOM:READED:${key}`);
  return table.roomMessagesUnRead.delete(
    {
      room: key,
      userAgent: userAgentId,
    },
    { transacting }
  );
}

module.exports = { markAsRead };
