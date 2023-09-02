const _ = require('lodash');

async function getUserAgentRoomsList({ userAgent, ctx }) {
  const uair = await ctx.tx.db.UserAgentInRoom.find({ userAgent }).lean();
  const roomKeys = _.map(uair, 'room');
  const [rooms, unreadMessages, userAgents] = await Promise.all([
    ctx.tx.db.Room.find({ key: roomKeys }).lean(),
    ctx.tx.db.RoomMessagesUnRead.find({
      room: roomKeys,
      userAgent,
    }).lean(),
    ctx.tx.db.UserAgentInRoom.find({ room: roomKeys, deleted: { $ne: null } }).lean(),
  ]);

  const userAgentsByRoom = _.groupBy(userAgents, 'room');

  const userAgen = await ctx.tx.call('users.users.getUserAgentsInfo', {
    userAgentIds: _.map(userAgents, 'userAgent'),
    withProfile: true,
  });

  const userAgentsById = _.keyBy(userAgen, 'id');

  const result = [];
  const unreadMessagesByRoom = _.keyBy(unreadMessages, 'room');
  const uairByRoom = _.keyBy(uair, 'room');
  _.forEach(rooms, (room) => {
    result.push({
      ...room,
      nameReplaces: JSON.parse(room.nameReplaces),
      metadata: JSON.parse(room.metadata),
      muted: uairByRoom[room.key]?.muted || false,
      attached: uairByRoom[room.key]?.attached || null,
      isAdmin: uairByRoom[room.key]?.isAdmin || null,
      adminMuted: uairByRoom[room.key]?.adminMuted || null,
      unreadMessages: unreadMessagesByRoom[room.key]?.count || 0,
      userAgents: _.map(userAgentsByRoom[room.key], (a) => ({
        userAgent: userAgentsById[a.userAgent],
        adminMuted: a.adminMuted,
        isAdmin: a.isAdmin,
        deleted: a.deleted,
      })),
    });
  });

  return result;
}

module.exports = { getUserAgentRoomsList };
