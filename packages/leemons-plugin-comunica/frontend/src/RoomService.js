import _ from 'lodash';
import SocketIoService from '@socket-io/service';

class RoomService {
  constructor(room) {
    this.room = room;
  }

  getRoom() {
    return RoomService.getRoom(this.room);
  }

  getRoomMessages() {
    return RoomService.getRoomMessages(this.room);
  }

  markRoomMessagesAsRead() {
    return RoomService.markRoomMessagesAsRead(this.room);
  }

  sendMessageToRoom(message) {
    return RoomService.sendMessageToRoom(this.room, message);
  }

  watchRoom(callback) {
    return RoomService.watchRoom(this.room, callback);
  }

  static watchRoom(key, callback) {
    return SocketIoService.useOn(`COMUNICA:ROOM:${key}`, (event, data) => {
      callback(data);
    });
  }

  static watchRooms(keys, callback) {
    let k = _.isArray(keys) ? keys : [keys];
    k = _.map(k, (key) => `COMUNICA:ROOM:${key}`);
    return SocketIoService.useOnAny((event, data) => {
      if (k.indexOf(event) !== -1) {
        callback(event.replace('COMUNICA:ROOM:', ''), data);
      }
    });
  }

  static watchOnReadRooms(keys, callback) {
    let k = _.isArray(keys) ? keys : [keys];
    k = _.map(k, (key) => `COMUNICA:ROOM:READED:${key}`);
    return SocketIoService.useOnAny((event, data) => {
      if (k.indexOf(event) !== -1) {
        callback(event.replace('COMUNICA:ROOM:READED:', ''), data);
      }
    });
  }

  static sendMessageToRoom(key, message) {
    return leemons.api(`comunica/room/${key}/messages`, {
      allAgents: true,
      method: 'POST',
      body: {
        message,
      },
    });
  }

  static async getRoomMessages(key) {
    const { messages } = await leemons.api(`comunica/room/${key}/messages`, {
      allAgents: true,
      method: 'GET',
    });
    return messages;
  }

  static async markRoomMessagesAsRead(key) {
    const { messages } = await leemons.api(`comunica/room/${key}/messages/read`, {
      allAgents: true,
      method: 'POST',
    });
    return messages;
  }

  static async getRoom(key) {
    const { room } = await leemons.api(`comunica/room/${key}`, {
      allAgents: true,
      method: 'GET',
    });
    return room;
  }

  static async getUnreadMessages(keys) {
    const { count } = await leemons.api(`comunica/room/messages/unread`, {
      allAgents: true,
      method: 'POST',
      body: {
        keys,
      },
    });
    return count;
  }
}

export { RoomService };
export default RoomService;
