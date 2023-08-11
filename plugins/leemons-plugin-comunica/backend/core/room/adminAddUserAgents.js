const _ = require('lodash');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');
const { addUserAgents } = require('./addUserAgents');

async function adminAddUserAgents(key, userAgents, userAgentAdmin, { transacting } = {}) {
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

  if (!admin.isAdmin) throw new Error('You don`t have permissions for remove users in this room');

  return addUserAgents(key, userAgents, { ignoreCalledFrom: true, transacting });
}

module.exports = { adminAddUserAgents };
