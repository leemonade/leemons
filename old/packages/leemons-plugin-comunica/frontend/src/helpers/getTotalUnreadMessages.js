import _ from 'lodash';
import getRoomChildrens from '@comunica/helpers/getRoomChildrens';

export function getTotalUnreadMessages(rooms, allRooms) {
  let total = 0;
  _.forEach(rooms, (room) => {
    const childrens = getRoomChildrens(allRooms, room);
    if (childrens?.length) {
      total += getTotalUnreadMessages(childrens, allRooms);
    } else {
      total += room.unreadMessages;
    }
  });
  return total;
}

export default getTotalUnreadMessages;
