import React from 'react';
import _ from 'lodash';
import { ActionButton, Box, Button, Drawer, Popover } from '@bubbles-ui/components';
import { ChevronLeftIcon, PluginSettingsIcon, RemoveIcon } from '@bubbles-ui/icons/outline';
import PropTypes from 'prop-types';
import getRoomParsed from '@comunica/helpers/getRoomParsed';
import RoomHeader from '@comunica/components/RoomHeader/RoomHeader';
import getRoomsByParent from '@comunica/helpers/getRoomsByParent';
import isTeacherByRoom from '@comunica/helpers/isTeacherByRoom';
import getRoomChildrens from '@comunica/helpers/getRoomChildrens';
import ChatListDrawerItem from '@comunica/components/ChatListDrawerItem/ChatListDrawerItem';
import RoomService from '@comunica/RoomService';
import { ChatListDrawerIntermediateStyles } from './ChatListDrawerIntermediate.styles';

function ChatListDrawerIntermediate({
  t,
  room: _room,
  opened,
  onClickRoom = () => {},
  onReturn = () => {},
  onClose = () => {},
}) {
  const { classes } = ChatListDrawerIntermediateStyles({}, { name: 'ChatListDrawerIntermediate' });

  async function toggleAttached() {
    await RoomService.toggleRoomAttached(_room.key);
  }

  const room = React.useMemo(() => getRoomParsed(_room), [_room]);
  const rooms = React.useMemo(() => {
    let types = null;
    // "plugins.assignables.assignation.user"
    // "plugins.assignables.assignation.subject"
    // "plugins.assignables.assignation.group"
    if (room.type === 'plugins.assignables.assignation') {
      if (isTeacherByRoom(room)) {
        types = [
          'plugins.assignables.assignation.group',
          'plugins.assignables.assignation.subject',
        ];
      } else {
        types = ['plugins.assignables.assignation.group', 'plugins.assignables.assignation.user'];
      }
    }
    let results = getRoomsByParent(room.childrens, room, types);
    if (room.type === 'plugins.assignables.assignation') {
      const subjectRooms = _.filter(results, { type: 'plugins.assignables.assignation.subject' });
      // Si solo tenemos una sala de tipo asignatura pintamos directamente sus salas hijas
      if (subjectRooms.length === 1) {
        results = _.filter(
          results,
          ({ type }) => type !== 'plugins.assignables.assignation.subject'
        );
        const subjectChildrens = getRoomChildrens(room.childrens, subjectRooms[0]);
        results.push(...subjectChildrens);
      }
    }
    return _.orderBy(results, ['attached', 'type'], ['asc', 'asc']);
  }, [room]);

  return (
    <>
      <Drawer opened={opened} size={430} close={false} empty>
        <Box className={classes.wrapper}>
          <Box className={classes.header}>
            <Button
              variant="link"
              color="secondary"
              onClick={onReturn}
              leftIcon={<ChevronLeftIcon width={12} height={12} />}
            >
              {t('return')}
            </Button>
            <Box className={classes.headerRight}>
              <Popover
                target={
                  <ActionButton
                    onClick={onClose}
                    icon={<PluginSettingsIcon width={16} height={16} />}
                  />
                }
              >
                <Box className={classes.config}>
                  <Button onClick={toggleAttached} fullWidth variant="light" color="secondary">
                    {room?.attached ? t('unsetRoom') : t('setRoom')}
                  </Button>
                </Box>
              </Popover>
              <ActionButton onClick={onClose} icon={<RemoveIcon width={16} height={16} />} />
            </Box>
          </Box>
          <RoomHeader t={t} room={room} />
          <Box className={classes.itemsList}>
            {rooms.map((r) => (
              <ChatListDrawerItem key={r.id} t={t} room={r} onClick={() => onClickRoom(r)} />
            ))}
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
  onClickRoom: PropTypes.func,
  onSelectRoom: PropTypes.func,
};

export { ChatListDrawerIntermediate };
export default ChatListDrawerIntermediate;
