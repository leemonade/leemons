import React from 'react';
import _ from 'lodash';
import {
  Menu,
  ActionButton,
  Box,
  Stack,
  Button,
  BaseDrawer,
  TotalLayoutContainer,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import { ChevronLeftIcon, RemoveIcon } from '@bubbles-ui/icons/outline';
import { SettingMenuVerticalIcon } from '@bubbles-ui/icons/solid';
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
  const scrollRef = React.useRef(null);

  async function toggleAttached() {
    await RoomService.toggleRoomAttached(_room.key);
  }

  const room = React.useMemo(() => getRoomParsed(_room), [_room]);
  const rooms = React.useMemo(() => {
    let types = null;
    // "assignables.assignation.user"
    // "assignables.assignation.subject"
    // "assignables.assignation.group"
    if (room.type === 'assignables.assignation') {
      if (isTeacherByRoom(room)) {
        types = ['assignables.assignation.group', 'assignables.assignation.subject'];
      } else {
        types = ['assignables.assignation.group', 'assignables.assignation.user'];
      }
    }
    let results = getRoomsByParent(room.childrens, room, types);
    if (room.type === 'assignables.assignation') {
      const subjectRooms = _.filter(results, { type: 'assignables.assignation.subject' });
      // Si solo tenemos una sala de tipo asignatura pintamos directamente sus salas hijas
      if (subjectRooms.length === 1) {
        results = _.filter(results, ({ type }) => type !== 'assignables.assignation.subject');
        const subjectChildrens = getRoomChildrens(room.childrens, subjectRooms[0]);
        results.push(...subjectChildrens);
      }
    }
    return _.orderBy(results, ['attached', 'type'], ['asc', 'asc']);
  }, [room]);

  return (
    <BaseDrawer opened={opened} size={400} close={false} empty>
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <Box className={classes.headerWrapper}>
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
                <Menu
                  control={
                    <ActionButton icon={<SettingMenuVerticalIcon width={16} height={16} />} />
                  }
                  items={[
                    {
                      children: room?.attached ? t('unsetRoom') : t('setRoom'),
                      onClick: toggleAttached,
                    },
                  ]}
                ></Menu>
                <ActionButton onClick={onClose} icon={<RemoveIcon width={16} height={16} />} />
              </Box>
            </Box>
            <RoomHeader t={t} room={room} />
          </Box>
        }
      >
        <Stack ref={scrollRef} fullWidth fullHeight style={{ overflowY: 'auto' }}>
          <TotalLayoutStepContainer fullWidth clean noMargin>
            {rooms.map((r) => (
              <ChatListDrawerItem key={r.id} t={t} room={r} onClick={() => onClickRoom(r)} />
            ))}
          </TotalLayoutStepContainer>
        </Stack>
      </TotalLayoutContainer>
    </BaseDrawer>
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
