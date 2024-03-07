/* eslint-disable no-param-reassign */
const _ = require('lodash');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');
const { decrypt } = require('../helpers/decrypt');

async function getMessages({ key, userAgent, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });

  await validateNotExistRoomKey({ key, ctx });
  try {
    await validateNotExistUserAgentInRoomKey({ key, userAgent, ctx });
  } catch (error) {
    // Si el usuario no esta en la sala, comprobamos si tiene permisos para ver el item
    const hasPermission = await ctx.tx.call('users.permissions.userAgentHasPermissionToItem', {
      userAgentId: userAgent,
      item: key,
    });

    if (!hasPermission) throw error;
  }
  const [userAgentsInRoom, messages] = await Promise.all([
    ctx.tx.db.UserAgentInRoom.find({ room: key }, undefined, { excludeDeleted: false }).lean(),
    ctx.tx.db.Message.find({ room: key }).sort({ createdAt: 1 }).lean(),
  ]);

  const userAgentsById = _.keyBy(userAgentsInRoom, 'userAgent');

  console.log('messages', messages);

  _.forEach(messages, (message) => {
    message.message = JSON.parse(message.message || null);
    if (message.isEncrypt) {
      message.message = decrypt(message.message, userAgentsById[message.userAgent].encryptKey);
    }
  });

  return messages;
}

module.exports = { getMessages };
