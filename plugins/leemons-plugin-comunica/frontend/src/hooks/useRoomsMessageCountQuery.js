import { useQuery } from '@tanstack/react-query';
import RoomService from '@comunica/RoomService';

const useRoomsMessageCountQuery = (rooms) => {
  const fetchMessages = async () => {
    if (!rooms?.length) {
      return { unread: 0, count: 0, read: 0 };
    }
    const unread = await RoomService.getUnreadMessages(rooms);
    const count = await RoomService.getMessagesCount(rooms);
    return { unread, count, read: count - unread };
  };

  const {
    data: messages = { unread: 0, count: 0, read: 0 },
    isLoading,
    isError,
    refetch,
  } = useQuery(['roomsMessageCount', rooms], fetchMessages, {
    enabled: !!rooms,
    refetchOnWindowFocus: false,
  });

  RoomService.watchRooms(rooms, refetch);
  RoomService.watchOnReadRooms(rooms, refetch);

  return { messages, isLoading, isError };
};

export default useRoomsMessageCountQuery;
export { useRoomsMessageCountQuery };
