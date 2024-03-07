import React from 'react';
import { Box, Text } from '@bubbles-ui/components';
import { PluginComunicaIcon } from '@bubbles-ui/icons/outline';
import { useRoomsMessageCountQuery } from '../../hooks';
import { RoomItemDisplayStyles } from './RoomItemDisplay.styles';
import {
  ROOMITEMDISPLAY_DEFAULT_PROPS,
  ROOMITEMDISPLAY_PROP_TYPES,
} from './RoomItemDisplay.constants';

const RoomItemDisplay = ({ chatKeys }) => {
  const { classes } = RoomItemDisplayStyles({ name: 'RoomItemDisplay' });
  const {
    messages: { unread },
  } = useRoomsMessageCountQuery(chatKeys);

  const isChatKeysNumber = typeof chatKeys === 'number';
  const chatKeysOrUnread = isChatKeysNumber ? chatKeys : unread;
  const messageLimits = chatKeysOrUnread > 99 ? '+99' : chatKeysOrUnread;

  return (
    <Box className={classes.comunica}>
      <PluginComunicaIcon color={'#878D96'} width={18} height={18} />
      {messageLimits !== 0 && <Text className={classes.comunicaText}>{messageLimits}</Text>}
    </Box>
  );
};

RoomItemDisplay.defaultProps = ROOMITEMDISPLAY_DEFAULT_PROPS;
RoomItemDisplay.propTypes = ROOMITEMDISPLAY_PROP_TYPES;
RoomItemDisplay.displayName = 'RoomItemDisplay';

export { RoomItemDisplay };
export default RoomItemDisplay;
