import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, ImageLoader, Text } from '@bubbles-ui/components';
import CommentIcon from '../icons/CommentIcon.svg';
import { useRoomsMessageCount } from '../hooks';

export const UnreadMessagesStyles = createStyles((theme) => ({
  iconWrapper: {
    position: 'relative',
  },
  icon: {
    width: 30,
    height: 24,
    position: 'relative',
    display: 'block',
  },
  unreadCount: {
    position: 'absolute',
    width: 30,
    height: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  unreadCountText: {
    color: theme.other.global.content.color.text['default--reverse'],
  },
  text: {
    color: theme.other.global.content.color.text.subtle,
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
}));

export function UnreadMessages({ rooms }) {
  const { unread, count } = useRoomsMessageCount(rooms);

  const { classes } = UnreadMessagesStyles({}, { name: 'UnreadMessages' });

  if (!count) {
    return <Text className={classes.text}>-</Text>;
  }

  return (
    <Box className={classes.root}>
      {!!unread && (
        <Box className={classes.icon}>
          <ImageLoader width={30} height={24} src={CommentIcon} />
          <Box className={classes.unreadCount}>
            <Text strong className={classes.unreadCountText}>
              {unread > 99 ? '+99' : unread}
            </Text>
          </Box>
        </Box>
      )}
      <Text className={classes.text}>({count > 999 ? '+999' : count})</Text>
    </Box>
  );
}

UnreadMessages.propTypes = {
  rooms: PropTypes.any,
};

export default UnreadMessages;
