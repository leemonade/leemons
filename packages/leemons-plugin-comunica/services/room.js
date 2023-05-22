const room = require('../src/services/room');

module.exports = {
  add: room.add,
  get: room.get,
  exists: room.exist,
  update: room.update,
  getMessages: room.getMessages,
  addUserAgents: room.addUserAgents,
  existUserAgent: room.existUserAgent,
  removeUserAgents: room.removeUserAgents,
  getUserAgentRooms: room.getUserAgentRooms,
  getRoomsMessageCount: room.getRoomsMessageCount,
  getUnreadMessages: room.getUnreadMessages,
};
