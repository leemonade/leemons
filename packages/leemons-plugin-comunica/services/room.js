const room = require('../src/services/room');

module.exports = {
  add: room.add,
  addUserAgents: room.addUserAgents,
  removeUserAgents: room.removeUserAgents,
  getUnreadMessages: room.getUnreadMessages,
};
