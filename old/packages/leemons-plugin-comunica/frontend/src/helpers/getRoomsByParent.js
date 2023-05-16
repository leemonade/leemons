import _ from 'lodash';
import getRoomChildrens from '@comunica/helpers/getRoomChildrens';
import getTotalUnreadMessages from '@comunica/helpers/getTotalUnreadMessages';
import getRoomParsed from '@comunica/helpers/getRoomParsed';

export function getRoomsByParent(rooms, parent, types) {
  // eslint-disable-next-line no-nested-ternary
  const parentKey = parent ? (_.isString(parent) ? parent : parent.key) : parent;
  const results = _.filter(rooms, (room) => {
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

  return _.map(results, (room) => {
    const childrens = getRoomChildrens(rooms, room);
    return getRoomParsed({
      ...room,
      childrens,
      unreadMessages: childrens?.length
        ? getTotalUnreadMessages(childrens, rooms)
        : room.unreadMessages,
    });
  });
}

export default getRoomsByParent;
