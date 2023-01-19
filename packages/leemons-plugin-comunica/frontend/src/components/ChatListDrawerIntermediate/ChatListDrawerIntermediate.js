import React from 'react';
import { ActionButton, Box, Button, Drawer } from '@bubbles-ui/components';
import { ChevronLeftIcon, RemoveIcon } from '@bubbles-ui/icons/outline';
import PropTypes from 'prop-types';
import getRoomParsed from '@comunica/helpers/getRoomParsed';
import { ChatListDrawerIntermediateStyles } from './ChatListDrawerIntermediate.styles';

function ChatListDrawerIntermediate({
  t,
  room: _room,
  opened,
  onReturn = () => {},
  onClose = () => {},
}) {
  const { classes } = ChatListDrawerIntermediateStyles({}, { name: 'ChatListDrawerIntermediate' });

  const room = React.useMemo(() => getRoomParsed(_room), [_room]);

  return (
    <>
      <Drawer opened={opened} size={360} close={false} empty>
        <Box className={classes.wrapper}>
          <Box className={classes.header}>
            <Button
              variant="link"
              color="secondary"
              onClick={onClose}
              leftIcon={<ChevronLeftIcon width={12} height={12} />}
            >
              {t('return')}
            </Button>
            <Box className={classes.headerRight}>
              <ActionButton onClick={onClose} icon={<RemoveIcon width={16} height={16} />} />
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

ChatListDrawerIntermediate.propTypes = {
  t: PropTypes.func,
  room: PropTypes.object,
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onReturn: PropTypes.func,
};

export { ChatListDrawerIntermediate };
export default ChatListDrawerIntermediate;
