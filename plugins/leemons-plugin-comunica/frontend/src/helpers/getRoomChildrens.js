import _ from 'lodash';

export function getRoomChildrens(rooms, room) {
  const roomKey = _.isString(room) ? room : room.key;
  return _.filter(rooms, (r) => r.parentRoom?.includes(roomKey));
}

export default getRoomChildrens;
