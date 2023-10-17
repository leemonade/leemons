import SocketIoService from '@mqtt-socket-io/service';
import _ from 'lodash';

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

  toggleRoomMute() {
    return RoomService.toggleRoomMute(this.room);
  }

  toggleAdminRoomMute(userAgent) {
    return RoomService.toggleAdminRoomMute(this.room, userAgent);
  }

  toggleRoomAttached() {
    return RoomService.toggleRoomAttached(this.room);
  }

  watchRoom(callback) {
    return RoomService.watchRoom(this.room, callback);
  }

  adminRemoveUserAgentFromRoom(userAgent) {
    return RoomService.adminRemoveUserAgentFromRoom(this.room, userAgent);
  }

  adminUpdateRoomName(name) {
    return RoomService.adminUpdateRoomName(this.room, name);
  }

  adminAddUsersToRoom(userAgents) {
    return RoomService.adminAddUsersToRoom(this.room, userAgents);
  }

  adminRemoveRoom() {
    return RoomService.adminRemoveRoom(this.room);
  }

  adminChangeRoomImage(file) {
    return RoomService.adminRemoveRoom(this.room, file);
  }

  static adminChangeRoomImage(key, file) {
    const form = new FormData();
    form.append('image', file, file.name);
    return leemons.api(`comunica/room/${key}/admin/image`, {
      allAgents: true,
      method: 'POST',
      headers: {
        'content-type': 'none',
      },
      body: form,
    });
  }

  static createRoom(body) {
    return leemons.api(`comunica/room/create`, {
      allAgents: true,
      method: 'POST',
      body,
    });
  }

  static adminRemoveRoom(key) {
    return leemons.api(`comunica/room/${key}/admin/remove`, {
      allAgents: true,
      method: 'POST',
    });
  }

  static adminAddUsersToRoom(key, userAgents) {
    return leemons.api(`comunica/room/${key}/admin/users`, {
      allAgents: true,
      method: 'POST',
      body: {
        userAgents,
      },
    });
  }

  static adminUpdateRoomName(key, name) {
    return leemons.api(`comunica/room/${key}/admin/name`, {
      allAgents: true,
      method: 'POST',
      body: {
        name,
      },
    });
  }

  static adminRemoveUserAgentFromRoom(key, userAgent) {
    return leemons.api(`comunica/room/${key}/admin/remove`, {
      allAgents: true,
      method: 'POST',
      body: {
        userAgent,
      },
    });
  }

  static toggleAdminRoomMute(key, userAgent) {
    return leemons.api(`comunica/room/${key}/admin/mute`, {
      allAgents: true,
      method: 'POST',
      body: {
        userAgent,
      },
    });
  }

  static toggleRoomAttached(key) {
    return leemons.api(`comunica/room/${key}/attach`, {
      allAgents: true,
      method: 'POST',
    });
  }

  static adminDisableMessages(key) {
    return leemons.api(`comunica/room/${key}/admin/disable`, {
      allAgents: true,
      method: 'POST',
    });
  }

  static toggleRoomMute(key) {
    return leemons.api(`comunica/room/${key}/mute`, {
      allAgents: true,
      method: 'POST',
    });
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

  static async getMessagesCount(keys) {
    const { count } = await leemons.api(`comunica/room/messages/count`, {
      allAgents: true,
      method: 'POST',
      body: {
        keys,
      },
    });

    return count;
  }

  static async getRoomsList() {
    const { rooms } = await leemons.api(`comunica/room/list`, {
      allAgents: true,
      method: 'GET',
    });

    return rooms;
  }

  static async getConfig() {
    const { config } = await leemons.api(`comunica/config`, {
      allAgents: true,
      method: 'GET',
    });

    return config;
  }

  static async saveConfig(body) {
    const { config } = await leemons.api(`comunica/config`, {
      allAgents: true,
      method: 'POST',
      body,
    });

    return config;
  }

  static async getAdminConfig(center) {
    const { config } = await leemons.api(`comunica/admin/config/${center}`);

    return config;
  }

  static async saveAdminConfig(center, data) {
    const { config } = await leemons.api(`comunica/admin/config/${center}`, {
      allAgents: true,
      method: 'POST',
      body: data,
    });

    return config;
  }

  static async getGeneralConfig() {
    const { config } = await leemons.api(`comunica/config/general`);
    return config;
  }

  static async getCenterConfig(center) {
    const { config } = await leemons.api(`comunica/config/center/${center}`);
    return config;
  }

  static async getProgramConfig(program) {
    const { config } = await leemons.api(`comunica/config/program/${program}`);
    return config;
  }
}

export { RoomService };
export default RoomService;
