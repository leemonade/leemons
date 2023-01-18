const _ = require('lodash');
const { table } = require('../tables');

async function getUserAgentRoomsList(userAgent, { userSession, transacting } = {}) {
  const uair = await table.userAgentInRoom.find({ userAgent }, { transacting });
  const [rooms, unreadMessages] = await Promise.all([
    table.room.find({ key_$in: _.map(uair, 'room') }, { transacting }),
    table.roomMessagesUnRead.find(
      {
        room_$in: _.map(uair, 'room'),
        userAgent,
      },
      { transacting }
    ),
  ]);

  const result = [];
  const withParent = {};
  const unreadMessagesByRoom = _.keyBy(unreadMessages, 'room');
  const uairByRoom = _.keyBy(uair, 'room');
  _.forEach(rooms, (room) => {
    if (room.parentRoom) {
      if (!withParent[room.parentRoom]) {
        withParent[room.parentRoom] = [];
      }
      withParent[room.parentRoom].push({
        ...room,
        muted: uairByRoom[room.id]?.muted || false,
        unreadMessages: unreadMessagesByRoom[room.id]?.count || 0,
      });
    } else {
      result.push({
        ...room,
        muted: uairByRoom[room.id]?.muted || false,
        unreadMessages: unreadMessagesByRoom[room.id]?.count || 0,
      });
    }
  });
  _.forIn(withParent, (r, key) => {
    const index = _.findIndex(result, { key });
    if (index >= 0) {
      result[index].childRooms = r;
    } else {
      result.push(...r);
    }
  });
  return result;
}

module.exports = { getUserAgentRoomsList };
