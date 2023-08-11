const _ = require('lodash');
const { table } = require('../tables');

async function getUserAgentRooms(userAgent, { transacting } = {}) {
  const rooms = await table.userAgentInRoom.find({ userAgent }, { transacting });
  return _.map(rooms, 'room');
}

module.exports = { getUserAgentRooms };
