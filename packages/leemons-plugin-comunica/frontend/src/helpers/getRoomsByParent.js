import _ from 'lodash';

export function getRoomsByParent(rooms, parentKey) {
  return _.filter(rooms, (room) => {
    if (!room.parentRoom && !parentKey) return true;
    if (room.parentRoom) return room.parentRoom.includes(parentKey);
    return false;
  });
}

export default getRoomsByParent;
