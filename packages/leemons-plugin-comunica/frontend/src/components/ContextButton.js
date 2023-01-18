import React from 'react';
import _ from 'lodash';
import { Box, createStyles, Text } from '@bubbles-ui/components';
import { CommentIcon } from '@bubbles-ui/icons/solid';
import { useStore } from '@common';
import SocketIoService from '@socket-io/service';
import ChatListDrawer from '@comunica/ChatListDrawer/ChatListDrawer';
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
  const [store, render] = useStore();
  const { classes } = ContextButtonStyles({}, { name: 'ContextButton' });

  function calculeRoomsData() {
    store.unreadMessages = 0;
    _.forEach(store.rooms, (room) => {
      store.unreadMessages += room.unreadMessages;
    });
    // TODO: Add if muted
  }

  async function load() {
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
    if (event === 'COMUNICA:CONFIG') {
      store.config = data;
      render();
    }
  });

  return (
    <>
      <Box className={classes.root}>
        <Box className={classes.chatBullet} onClick={toggleDrawer}>
          <CommentIcon className={classes.chatIcon} />
          {store.unreadMessages ? (
            <Box className={classes.unreadMessages}>
              <Text role="productive" size="xs" strong>
                {store.unreadMessages > 99 ? '+99' : store.unreadMessages}
              </Text>
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
