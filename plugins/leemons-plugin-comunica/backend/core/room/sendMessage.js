/* eslint-disable no-param-reassign */
const _ = require('lodash');
const Filter = require('bad-words');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');
const { getCenter } = require('../config/getCenter');
const { encrypt } = require('../helpers/encrypt');

async function setMessageUnRead({ key, userAgentId, message, ctx }) {
  const item = await ctx.tx.db.RoomMessagesUnRead.findOne({
    room: key,
    userAgent: userAgentId,
  })
    .select(['count'])
    .lean();
  return ctx.tx.db.RoomMessagesUnRead.updateOne(
    {
      room: key,
      userAgent: userAgentId,
    },
    {
      room: key,
      userAgent: userAgentId,
      message,
      count: item && item.count ? item.count + 1 : 1,
    },
    { upsert: true }
  );
}

async function sendMessage({ key, userAgent: _userAgent, message: _message, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });

  await validateNotExistRoomKey({ key, ctx });
  await validateNotExistUserAgentInRoomKey({ key, userAgent: _userAgent.id, ctx });

  const [room, userAgent, userAgentsInRoom] = await Promise.all([
    ctx.tx.db.Room.findOne({ key }).select(['useEncrypt']).lean(),
    ctx.tx.db.UserAgentInRoom.findOne({ room: key, userAgent: _userAgent.id })
      .select(['encryptKey'])
      .lean(),
    ctx.tx.db.UserAgentInRoom.find({ room: key }).select(['userAgent']).lean(),
  ]);

  const userAgentsWithPermissions = await ctx.tx.call(
    'users.permissions.getUserAgentsWithPermissionsForItem',
    { item: key, type: 'comunica.room.view' }
  );

  const userAgentIds = _.uniq(
    _.map(userAgentsInRoom, 'userAgent').concat(userAgentsWithPermissions)
  );
  const promises = [];

  const message = _message;
  if (message.type === 'text') {
    const center = await ctx.tx.call('users.users.getUserAgentCenter', { userAgent: _userAgent });
    const centerConfig = await getCenter({ center: center.id, ctx });
    if (centerConfig.enableSecureWords) {
      const words = _.map(centerConfig.secureWords.split(','), (word) => word.trim());
      const filter = new Filter({ list: words });
      message.content = filter.clean(message.content);
    }
  }

  let response = await ctx.tx.db.Message.create({
    room: key,
    userAgent: _userAgent.id,
    message: JSON.stringify(room.useEncrypt ? encrypt(message, userAgent.encryptKey) : message),
    isEncrypt: room.useEncrypt,
  });
  response = response.toObject();

  _.forEach(userAgentIds, (userAgentId) => {
    promises.push(setMessageUnRead({ key, userAgentId, message: response.id, ctx }));
  });

  await Promise.all(promises);

  await ctx.socket.emit(userAgentIds, `COMUNICA:ROOM:${key}`, {
    ...response,
    message,
  });

  return response;
}

module.exports = { sendMessage };
