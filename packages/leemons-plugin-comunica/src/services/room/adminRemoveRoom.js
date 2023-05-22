const _ = require('lodash');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');
const { remove } = require('./remove');

async function adminRemoveRoom(key, userAgents, userAgentAdmin, { transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);
  await validateNotExistRoomKey(key, { transacting });
  await validateNotExistUserAgentInRoomKey(key, userAgentAdmin, { transacting });
  const admin = await table.userAgentInRoom.findOne(
    {
      room: key,
      userAgent: userAgentAdmin,
    },
    { transacting }
  );

  if (!admin.isAdmin) throw new Error('You don`t have permissions for remove this room');

  return remove(key, { ignoreCalledFrom: true, transacting });
}

module.exports = { adminRemoveRoom };
