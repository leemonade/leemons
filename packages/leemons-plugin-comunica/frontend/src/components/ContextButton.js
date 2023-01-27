import React from 'react';
import _ from 'lodash';
import { Box, createStyles, useDebouncedCallback } from '@bubbles-ui/components';
import { CommentIcon, VolumeControlOffIcon } from '@bubbles-ui/icons/solid';
import { useStore } from '@common';
import SocketIoService from '@socket-io/service';
import { ChatListDrawer, RoomAvatar } from '@comunica/components';
import { useNotifications } from '@bubbles-ui/notifications';
import { getCentersWithToken } from '@users/session';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@comunica/helpers/prefixPN';
import getRoomParsed from '@comunica/helpers/getRoomParsed';
import { RoomService } from '../RoomService';

export const ContextButtonStyles = createStyles((theme) => ({
  root: {
    position: 'fixed',
    zIndex: 5,
    bottom: theme.spacing[7],
    right: theme.spacing[7],
  },
  chatBullet: {
    width: 56,
    height: 56,
    backgroundColor: theme.other.global.background.color.primary.default,
    borderRadius: '50%',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.other.global.background.color.primary.emphasis,
    },
  },
  chatIcon: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 32,
    height: 29,
    color: 'white',
    transform: 'translate(-50%, -50%)',
  },
  unreadMessages: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    display: 'inline-flex',
    color: theme.other.global.background.color.primary.emphasis,
    ...theme.other.global.content.typoMobile.body['lg--bold'],
    '&:after': {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      display: 'block',
      content: '""',
      width: 22,
      height: 16,
      zIndex: -1,
    },
  },
}));

function ContextButton({ onShowDrawerChange }) {
  const debouncedFunction = useDebouncedCallback(100);
  const debouncedFunction2 = useDebouncedCallback(300);
  const [store, render] = useStore();
  const [t] = useTranslateLoader(prefixPN('chatListDrawer'));
  const notifications = useNotifications('chat');
  const { classes } = ContextButtonStyles({}, { name: 'ContextButton' });

  function calculeRoomsData() {
    store.unreadMessages = 0;
    _.forEach(store.rooms, (room) => {
      store.unreadMessages += room.unreadMessages;
    });
  }

  async function load() {
    store.userAgent = getCentersWithToken()[0].userAgentId;
    store.config = await RoomService.getConfig();
    store.rooms = await RoomService.getRoomsList();
    calculeRoomsData();
    render();
  }

  function toggleDrawer() {
    store.showDrawer = !store.showDrawer;
    onShowDrawerChange(store.showDrawer);
    render();
  }

  function onRoomOpened(room) {
    store.roomOpened = room;
  }

  React.useEffect(() => {
    load();
  }, []);

  SocketIoService.useOnAny((event, data) => {
    console.log('SocketIoService', event, data);
    if (event === 'COMUNICA:CONFIG') {
      store.config = data;
      render();
      return;
    }
    if (event === 'COMUNICA:CONFIG:ROOM') {
      const index = _.findIndex(store.rooms, { key: data.room });
      store.rooms[index].muted = !!data.muted;
      render();
      return;
    }
    if (event === 'COMUNICA:ROOM:ADDED') {
      debouncedFunction(load);
      return;
    }
    if (event === 'COMUNICA:ROOM:USER_ADDED') {
      debouncedFunction2(load);
      return;
    }
    _.forEach(store.rooms, (room, index) => {
      if (`COMUNICA:ROOM:${room.key}` === event) {
        if (
          store.userAgent !== data.userAgent &&
          !room.muted &&
          !store.config?.muted &&
          store.roomOpened?.id !== room.id
        ) {
          if (data.message?.type === 'text') {
            notifications.showNotification({
              title: t(room.name, room.nameReplaces, false, room.name),
              message: data.message.content,
              leftSide: <RoomAvatar room={getRoomParsed(room)} size={32} />,
            });
          }
        }
        store.rooms[index].unreadMessages += 1;
        calculeRoomsData();
        render();
        return false;
      }
      if (`COMUNICA:ROOM:READED:${room.key}` === event) {
        store.rooms[index].unreadMessages = 0;
        calculeRoomsData();
        render();
        return false;
      }
    });
  });

  return (
    <>
      <Box className={classes.root}>
        <Box className={classes.chatBullet} onClick={toggleDrawer}>
          <CommentIcon className={classes.chatIcon} />
          {store.unreadMessages && !store.config?.muted ? (
            <Box className={classes.unreadMessages}>
              {store.unreadMessages > 99 ? '+99' : store.unreadMessages}
            </Box>
          ) : null}
          {store.config?.muted ? (
            <Box className={classes.unreadMessages}>
              <VolumeControlOffIcon />
            </Box>
          ) : null}
        </Box>
      </Box>
      <ChatListDrawer
        opened={store.showDrawer}
        onRoomOpened={onRoomOpened}
        onClose={toggleDrawer}
      />
    </>
  );
}

export { ContextButton };
export default ContextButton;
