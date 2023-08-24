import { Box, createStyles, useDebouncedCallback } from '@bubbles-ui/components';
import { CommentIcon, VolumeControlOffIcon } from '@bubbles-ui/icons/solid';
import { useNotifications } from '@bubbles-ui/notifications';
import { useStore } from '@common';
import { ChatListDrawer, RoomAvatar } from '@comunica/components';
import getRoomParsed from '@comunica/helpers/getRoomParsed';
import getRoomsByParent from '@comunica/helpers/getRoomsByParent';
import isStudentTeacherChatRoom from '@comunica/helpers/isStudentTeacherChatRoom';
import isStudentsChatRoom from '@comunica/helpers/isStudentsChatRoom';
import prefixPN from '@comunica/helpers/prefixPN';
import SocketIoService from '@mqtt-socket-io/service';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getCentersWithToken } from '@users/session';
import hooks from 'leemons-hooks';
import _ from 'lodash';
import React from 'react';
import { RoomService } from '../RoomService';

export const ContextButtonStyles = createStyles((theme) => ({
  root: {
    position: 'fixed',
    zIndex: 55,
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
    ...theme.other.global.content.typoMobile.body['lg--bold'],
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

function ContextButton({ onShowDrawerChange }) {
  const debouncedFunction = useDebouncedCallback(100);
  const debouncedFunction2 = useDebouncedCallback(300);
  const [store, render] = useStore();
  const [t] = useTranslateLoader(prefixPN('chatListDrawer'));
  const notifications = useNotifications('chat');
  const { classes } = ContextButtonStyles({}, { name: 'ContextButton' });

  function isOnParentRooms(parentKey) {
    const room = _.find(store.originalRooms, { key: parentKey });
    if (!room) return false;
    if (room.parentRoom) {
      return isOnParentRooms(room.parentRoom);
    }
    const inside = _.find(store.parentRooms, { key: room.key });
    return !!inside;
  }

  function calculeRoomsData() {
    store.unreadMessages = 0;
    _.forEach(store.originalRooms, (room) => {
      if (isOnParentRooms(room.parentRoom || room.key)) {
        store.unreadMessages += room.unreadMessages;
      }
    });
  }

  function recalcule() {
    store.parentRooms = _.orderBy(getRoomsByParent(store.originalRooms), ['attached'], ['asc']);
    if (!store.centerConfig?.enableStudentsChats) {
      store.parentRooms = _.filter(store.parentRooms, (room) => !isStudentsChatRoom(room));
    }
    if (store.centerConfig?.disableChatsBetweenStudentsAndTeachers) {
      store.parentRooms = _.filter(store.parentRooms, (room) => !isStudentTeacherChatRoom(room));
    }
    store.parentRooms = _.filter(store.parentRooms, (room) => {
      if (
        room.type === 'plugins.academic-portfolio.class' &&
        !store.programConfig[room.program]?.enableSubjectsRoom
      ) {
        return false;
      }
      return true;
    });
    calculeRoomsData();
  }

  async function load() {
    store.userAgent = getCentersWithToken()[0].userAgentId;
    const [centerConfig, originalRooms, config] = await Promise.all([
      RoomService.getCenterConfig(getCentersWithToken()[0].id),
      RoomService.getRoomsList(),
      RoomService.getConfig(),
    ]);
    const programIds = _.uniq(_.map(originalRooms, 'program'));
    const programConfigs = await Promise.all(
      _.map(programIds, (programId) => RoomService.getProgramConfig(programId))
    );
    store.programConfig = {};
    _.forEach(programIds, (programId, index) => {
      store.programConfig[programId] = programConfigs[index];
    });
    store.config = config;
    store.centerConfig = centerConfig;
    store.originalRooms = originalRooms;
    recalcule();
    render();
  }

  function closeDrawer() {
    store.showDrawer = false;
    onShowDrawerChange(store.showDrawer);
    render();
  }

  function toggleDrawer() {
    store.showDrawer = !store.showDrawer;
    onShowDrawerChange(store.showDrawer);
    render();
  }

  function onRoomOpened(room) {
    store.roomOpened = room;
    store.openRoom = null;
  }

  function _onRoomOpened({ args: [room] }) {
    onRoomOpened(room);
  }

  function _closeDrawer() {
    closeDrawer();
  }

  React.useEffect(() => {
    load();
  }, []);

  React.useEffect(() => {
    hooks.addAction('chat:onRoomOpened', _onRoomOpened);
    hooks.addAction('chat:closeDrawer', _closeDrawer);
    return () => {
      hooks.removeAction('chat:onRoomOpened', _onRoomOpened);
      hooks.removeAction('chat:closeDrawer', _closeDrawer);
    };
  }, []);

  SocketIoService.useOnAny((event, data) => {
    if (event === 'COMUNICA:CONFIG:CENTER') {
      if (data.center === getCentersWithToken()[0].id) {
        store.centerConfig = data.config;
        recalcule();
        render();
      }
      return;
    }
    if (event === 'COMUNICA:CONFIG:PROGRAM') {
      if (store.programConfig[data.program]) {
        store.programConfig[data.program] = data.config;
        recalcule();
        render();
      }
      return;
    }
    if (event === 'COMUNICA:CONFIG') {
      store.config = data;
      render();
      return;
    }
    if (event === 'COMUNICA:CONFIG:ROOM') {
      const index = _.findIndex(store.originalRooms, { key: data.room });
      store.originalRooms[index].muted = !!data.muted;
      render();
      return;
    }
    if (event === 'COMUNICA:ROOM:ADDED') {
      debouncedFunction(load);
      return;
    }
    if (event === 'COMUNICA:ROOM:USER_ADDED') {
      debouncedFunction2(load);
      return;
    }
    _.forEach(store.originalRooms, (room, index) => {
      if (`COMUNICA:ROOM:${room.key}` === event) {
        if (
          store.userAgent !== data.userAgent &&
          !room.muted &&
          !store.config?.muted &&
          store.roomOpened?.id !== room.id
        ) {
          if (data.message?.type === 'text') {
            notifications.showNotification({
              onClick: (e, notification) => {
                let node = e.target;
                if (e.target.nodeName === 'svg') {
                  node = e.target.parentNode;
                }
                if (!node.className.includes('mantine-Notification_chat-closeButton')) {
                  store.openRoom = room;
                  notifications.hideNotification(notification.id);
                  render();
                }
              },
              title: t(room.name, room.nameReplaces, false, room.name),
              message: data.message.content,
              leftSide: <RoomAvatar room={getRoomParsed(room)} size={32} />,
            });
          }
        }
        store.originalRooms[index].unreadMessages += 1;
        recalcule();
        render();
        return false;
      }
      if (`COMUNICA:ROOM:READED:${room.key}` === event) {
        store.originalRooms[index].unreadMessages = 0;
        recalcule();
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
              {store.unreadMessages > 99 ? '+99' : store.unreadMessages}
            </Box>
          ) : null}
          {store.config?.muted ? (
            <Box className={classes.unreadMessages}>
              <VolumeControlOffIcon />
            </Box>
          ) : null}
        </Box>
      </Box>
      <ChatListDrawer
        opened={store.showDrawer}
        openRoom={store.openRoom}
        onRoomOpened={onRoomOpened}
        onClose={closeDrawer}
      />
    </>
  );
}

export { ContextButton };
export default ContextButton;
