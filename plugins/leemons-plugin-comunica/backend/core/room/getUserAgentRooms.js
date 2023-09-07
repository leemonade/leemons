const _ = require('lodash');

async function getUserAgentRooms({ userAgent, ctx }) {
  const rooms = await ctx.tx.db.UserAgentInRoom.find({ userAgent }).select(['room']).lean();
  return _.map(rooms, 'room');
}

module.exports = { getUserAgentRooms };
