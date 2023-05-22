import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';
import { PluginComunicaIcon } from '@bubbles-ui/icons/outline';

export const ChatButtonStyles = createStyles((theme, { unread }) => ({
  root: {
    position: 'fixed',
    zIndex: 5,
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: unread ? theme.colors.interactive01 : theme.colors.uiBackground01,
    borderRadius: '0 0 0 4px',
    color: unread ? theme.colors.text07 : theme.colors.text03,
    fontSize: theme.fontSizes[5],
    cursor: 'pointer',
  },
  unread: {
    position: 'absolute',
    fontSize: '10px',
    padding: '2px 5px',
    backgroundColor: theme.colors.uiBackground01,
    left: '50%',
    bottom: '50%',
    borderRadius: '50%',
    color: theme.colors.interactive01,
    fontWeight: 500,
  },
}));

function ChatButton({ room, onClick }) {
  const { classes } = ChatButtonStyles({ unread: room?.unreadMessages }, { name: 'ChatButton' });
  return (
    <Box className={classes.root} onClick={onClick}>
      <PluginComunicaIcon />
      {room?.unreadMessages ? <Box className={classes.unread}>{room.unreadMessages}</Box> : null}
    </Box>
  );
}

ChatButton.propTypes = {
  room: PropTypes.any,
  onClick: PropTypes.func,
};

export { ChatButton };
export default ChatButton;
