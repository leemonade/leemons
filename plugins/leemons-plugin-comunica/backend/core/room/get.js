const _ = require('lodash');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

async function get({ key, userAgent, returnUserAgents = true, ctx }) {
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
  const [room, userAgents, nMessages, messagesUnread] = await Promise.all([
    ctx.tx.db.Room.findOne({ key }).lean(),
    ctx.tx.db.UserAgentInRoom.find({ room: key }, undefined, { excludeDeleted: false }).lean(),
    ctx.tx.db.Message.countDocuments({ room: key }),
    ctx.tx.db.RoomMessagesUnRead.findOne({
      room: key,
      userAgent,
    }).lean(),
  ]);

  room.unreadMessages = messagesUnread ? messagesUnread.count : 0;
  room.messages = nMessages;
  room.userAgents = _.map(userAgents, (a) => ({
    userAgent: a.userAgent,
    deleted: a.isDeleted,
    isDeleted: a.isDeleted,
  }));

  if (returnUserAgents) {
    const userAgen = await ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds: _.map(userAgents, 'userAgent'),
      withProfile: true,
    });

    const userAgentsById = _.keyBy(userAgen, 'id');
    room.userAgents = _.map(userAgents, (a) => ({
      userAgent: userAgentsById[a.userAgent],
      adminMuted: a.adminMuted,
      isAdmin: a.isAdmin,
      deleted: a.isDeleted,
      isDeleted: a.isDeleted,
    }));
  }

  const uair = _.find(userAgents, { userAgent });

  return {
    ...room,
    nameReplaces: JSON.parse(room.nameReplaces),
    metadata: JSON.parse(room.metadata),
    muted: uair?.muted || false,
    isAdmin: uair?.isAdmin,
    adminMuted: uair?.adminMuted,
    attached: uair?.attached || null,
  };
}

module.exports = { get };
