import _ from 'lodash';

export function getRoomsByParent(rooms, parent, types) {
  // eslint-disable-next-line no-nested-ternary
  const parentKey = parent ? (_.isString(parent) ? parent : parent.key) : parent;
  return _.filter(rooms, (room) => {
    if (!room.parentRoom && !parentKey) {
      if (types) return types.includes(room.type);
      return true;
    }
    if (room.parentRoom) {
      if (room.parentRoom.includes(parentKey)) {
        if (types) return types.includes(room.type);
        return true;
      }
      return false;
    }
    return false;
  });
}

export default getRoomsByParent;
