import { useCallback, useEffect, useState } from 'react';
import RoomService from '@comunica/RoomService';

const useRoomsMessageCount = (rooms) => {
  const [messages, setMessages] = useState({ unread: 0, count: 0, read: 0, room: null });
  const getNewMessages = useCallback(
    async (chatKeys) => {
      if (!chatKeys?.length) {
        return;
      }
      const unread = await RoomService.getUnreadMessages(chatKeys);
      const count = await RoomService.getMessagesCount(chatKeys);

      setMessages({ unread, count, read: count - unread });
    },
    [setMessages]
  );

  RoomService.watchRooms(rooms, () => {
    getNewMessages(rooms);
  });

  RoomService.watchOnReadRooms(rooms, () => {
    getNewMessages(rooms);
  });

  useEffect(() => {
    getNewMessages(rooms);
  }, [rooms]);

  return messages;
};

export default useRoomsMessageCount;
export { useRoomsMessageCount };
