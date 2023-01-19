import React from 'react';
import { Box, Text } from '@bubbles-ui/components';
import { CommentIcon, VolumeControlOffIcon } from '@bubbles-ui/icons/solid';
import PropTypes from 'prop-types';
import { RoomAvatar } from '@comunica/components/RoomAvatar/RoomAvatar';
import getRoomParsed from '@comunica/helpers/getRoomParsed';
import { ChatListDrawerItemStyles } from './ChatListDrawerItem.styles';

function ChatListDrawerItem({ room: _room, t, onClick = () => {} }) {
  const { classes } = ChatListDrawerItemStyles({}, { name: 'ChatListDrawerItem' });

  const room = React.useMemo(() => getRoomParsed(_room), [_room]);

  return (
    <Box onClick={onClick} className={classes.item}>
      <RoomAvatar room={room} />
      <Box className={classes.itemContent}>
        <Box className={classes.itemTitleContainer}>
          {room.name ? (
            <Box style={{ lineHeight: '1.2rem' }}>
              <Text size="md" role="productive" transform="capitalize" color="tertiary" strong>
                {t(room.name, room.nameReplaces, false, room.name)}
              </Text>
            </Box>
          ) : null}

          {room.subName ? (
            <Box style={{ lineHeight: '1.2rem' }}>
              <Text role="productive" transform="capitalize" color="soft">
                {room.subName}
              </Text>
            </Box>
          ) : null}
        </Box>
        {room.muted || room.unreadMessages ? (
          <Box className={classes.itemIcons}>
            {room.muted ? <VolumeControlOffIcon /> : null}
            {room.unreadMessages ? <CommentIcon /> : null}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

ChatListDrawerItem.propTypes = {
  t: PropTypes.func,
  room: PropTypes.any,
  onClick: PropTypes.func,
};

export { ChatListDrawerItem };
export default ChatListDrawerItem;
