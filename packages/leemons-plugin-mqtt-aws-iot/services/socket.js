const socket = require('../src/services/socket');
const data = require('../config/data');

module.exports = {
  setConfig: socket.setConfig,
  data,
  worker: {
    init: socket.init,
    emit: socket.emit,
    emitToAll: socket.emitToAll,
  },
  main: {
    init: () => {},
  },
};
