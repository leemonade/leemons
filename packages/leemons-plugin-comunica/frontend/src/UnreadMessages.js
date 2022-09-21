import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';
import { useStore } from '@common';
import RoomService from '@comunica/RoomService';

// eslint-disable-next-line import/prefer-default-export
export const UnreadMessagesStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.interactive01,
    color: theme.colors.uiBackground04,
    width: 16,
    height: 16,
    borderRadius: '50%',
    fontSize: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function UnreadMessages({ rooms }) {
  const { classes } = UnreadMessagesStyles({}, { name: 'UnreadMessages' });
  const [store, render] = useStore({});

  async function load() {
    store.count = await RoomService.getUnreadMessages(rooms);
    render();
  }

  React.useEffect(() => {
    load();
  }, [rooms]);

  RoomService.watchRooms(rooms, () => {
    store.count++;
    render();
  });

  RoomService.watchOnReadRooms(rooms, () => {
    load();
  });

  if (!store.count) return null;
  return <Box className={classes.root}>{store.count}</Box>;
}

UnreadMessages.propTypes = {
  rooms: PropTypes.any,
};

export { UnreadMessages };
export default UnreadMessages;
