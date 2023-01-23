import React from 'react';
import _ from 'lodash';
import { Box, createStyles, Text, useDebouncedCallback } from '@bubbles-ui/components';
import { CommentIcon, VolumeControlOffIcon } from '@bubbles-ui/icons/solid';
import { useStore } from '@common';
import SocketIoService from '@socket-io/service';
import { ChatListDrawer } from '@comunica/components';
import { RoomService } from '../RoomService';

export const ContextButtonStyles = createStyles((theme, {}) => ({
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

function ContextButton() {
  const debouncedFunction = useDebouncedCallback(100);
  const [store, render] = useStore();
  const { classes } = ContextButtonStyles({}, { name: 'ContextButton' });

  function calculeRoomsData() {
    store.unreadMessages = 0;
    _.forEach(store.rooms, (room) => {
      store.unreadMessages += room.unreadMessages;
    });
  }

  async function load() {
    store.config = await RoomService.getConfig();
    store.rooms = await RoomService.getRoomsList();
    calculeRoomsData();
    render();
  }

  function toggleDrawer() {
    store.showDrawer = !store.showDrawer;
    render();
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
    _.forEach(store.rooms, (room, index) => {
      if (`COMUNICA:ROOM:${room.key}` === event) {
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
              <Text role="productive" size="xs" strong>
                {store.unreadMessages > 99 ? '+99' : store.unreadMessages}
              </Text>
            </Box>
          ) : null}
          {store.config?.muted ? (
            <Box className={classes.unreadMessages}>
              <VolumeControlOffIcon />
            </Box>
          ) : null}
        </Box>
      </Box>
      <ChatListDrawer opened={store.showDrawer} onClose={toggleDrawer} />
    </>
  );
}

export { ContextButton };
export default ContextButton;
