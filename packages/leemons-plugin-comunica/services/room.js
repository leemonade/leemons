const room = require('../src/services/room');

module.exports = {
  add: room.add,
  get: room.get,
  getMessages: room.getMessages,
  addUserAgents: room.addUserAgents,
  removeUserAgents: room.removeUserAgents,
  getUserAgentRooms: room.getUserAgentRooms,
  getRoomsMessageCount: room.getRoomsMessageCount,
  getUnreadMessages: room.getUnreadMessages,
};
