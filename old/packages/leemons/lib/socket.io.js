const _ = require('lodash');
const socketIO = require('socket.io');
const {v4: uuidv4} = require('uuid');
const cluster = require('cluster');

let io;
const events = {};

class LeemonsSocketWorker {
  static init(httpServer, config = {}) {
    io = new socketIO.Server(
      httpServer,
      _.merge(
        {
          cors: {
            origin: '*',
          },
        },
        config
      )
    );
    process.on('message', (message) => {
      LeemonsSocketWorker.__onEvent(message);
    });
  }

  static onConnection(callback) {
    io.on('connection', callback);
  }

  static use(callback) {
    io.use(callback);
  }

  static getIo() {
    return io;
  }

  static emit(id, eventName, eventData) {
    const ids = _.isArray(id) ? id : [id];
    LeemonsSocketWorker.__emit('emitEvent', {ids, eventName, eventData});
  }

  static emitToAll(eventName, eventData) {
    LeemonsSocketWorker.__emit('emitToAllEvent', {eventName, eventData});
  }

  static getSockets() {
    return io.fetchSockets();
  }

  /** @private */
  static async __onEvent({subtype, type, uuid, data}) {
    if (subtype === 'socket.io:store') {
      if (events[uuid]) {
        await events[uuid](data);
        delete events[uuid];
      } else if (LeemonsSocketWorkerFunctions[type]) {
        LeemonsSocketWorkerFunctions[type](data);
      }
    }
  }

  /** @private */
  static __emit(type, data, callback) {
    const uuid = uuidv4();
    if (callback) events[uuid] = callback;
    if (_.isFunction(process.send)) {
      process.send({subtype: 'socket.io:store', type, uuid, data});
    } else {
      LeemonsSocketWorker.__onEvent({subtype: 'socket.io:store', type, uuid, data});
    }
  }

  /** @private */
  static async __emitToAllEvent({eventName, eventData}) {
    const sockets = await LeemonsSocketWorker.getSockets();
    _.forEach(sockets, (socket) => {
      socket.emit(eventName, eventData);
    });
  }

  /** @private */
  static async __emitEvent({ids, eventName, eventData}) {
    const sockets = await LeemonsSocketWorker.getSockets();
    _.forEach(sockets, (socket) => {
      if (ids.indexOf(socket.session.id) >= 0) {
        socket.emit(eventName, eventData);
      } else if (_.isArray(socket.session.userAgents)) {
        const userAgent = _.find(socket.session.userAgents, ({id}) => ids.indexOf(id) >= 0);
        if (userAgent) socket.emit(eventName, eventData);
      }
    });
  }
}

class LeemonsSocketMain {
  static init() {
    cluster.on('message', (worker, message) => {
      LeemonsSocketMain.__onEvent(message);
    });
  }

  /** @private */
  static __emit(worker, uuid, type, data) {
    worker.send({subtype: 'socket.io:store', type, uuid, data});
  }

  /** @private */
  static __emitEvent(uuid, data) {
    for (const id in cluster.workers) {
      LeemonsSocketMain.__emit(cluster.workers[id], null, 'emitEvent', data);
    }
  }

  /** @private */
  static __emitToAllEvent(uuid, data) {
    for (const id in cluster.workers) {
      LeemonsSocketMain.__emit(cluster.workers[id], null, 'emitToAllEvent', data);
    }
  }

  /** @private */
  static __onEvent({subtype, type, uuid, data}) {
    if (subtype === 'socket.io:store') {
      if (LeemonsSocketMainFunctions[type]) {
        LeemonsSocketMainFunctions[type](uuid, data);
      }
    }
  }
}

const LeemonsSocketWorkerFunctions = {
  emitEvent: LeemonsSocketWorker.__emitEvent,
  emitToAllEvent: LeemonsSocketWorker.__emitToAllEvent,
};

const LeemonsSocketMainFunctions = {
  emitEvent: LeemonsSocketMain.__emitEvent,
  emitToAllEvent: LeemonsSocketMain.__emitToAllEvent,
};

class LeemonsSocket {
  static main = LeemonsSocketMain;

  static worker = LeemonsSocketWorker;
}

module.exports = {
  LeemonsSocket,
};
