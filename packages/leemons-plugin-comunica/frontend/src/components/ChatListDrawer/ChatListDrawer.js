import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import {
  ActionButton,
  Box,
  Button,
  CheckBoxGroup,
  Drawer,
  Popover,
  Switch,
  TextInput,
  Title,
  useDebouncedCallback,
} from '@bubbles-ui/components';
import { FilterIcon, PluginSettingsIcon, RemoveIcon, SearchIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import ChatAddUsersDrawer from '@comunica/components/ChatAddUsersDrawer/ChatAddUsersDrawer';
import ChatInfoDrawer from '@comunica/components/ChatInfoDrawer/ChatInfoDrawer';
import ChatListDrawerIntermediate from '@comunica/components/ChatListDrawerIntermediate/ChatListDrawerIntermediate';
import ChatListDrawerItem from '@comunica/components/ChatListDrawerItem/ChatListDrawerItem';
import getChatUserAgent from '@comunica/helpers/getChatUserAgent';
import getRoomChildrens from '@comunica/helpers/getRoomChildrens';
import getRoomsByParent from '@comunica/helpers/getRoomsByParent';
import getTotalUnreadMessages from '@comunica/helpers/getTotalUnreadMessages';
import isStudentsChatRoom from '@comunica/helpers/isStudentsChatRoom';
import isStudentTeacherChatRoom from '@comunica/helpers/isStudentTeacherChatRoom';
import prefixPN from '@comunica/helpers/prefixPN';
import SocketIoService from '@mqtt-socket-io/service';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getCentersWithToken } from '@users/session';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { RoomService } from '../../RoomService';
import ChatDrawer from '../ChatDrawer/ChatDrawer';
import { ChatListDrawerStyles } from './ChatListDrawer.styles';

function ChatListDrawer({ opened, openRoom, onRoomOpened = () => {}, onClose = () => {} }) {
  const debouncedFunction = useDebouncedCallback(100);
  const debouncedFunction2 = useDebouncedCallback(100);
  const { classes } = ChatListDrawerStyles({}, { name: 'ChatListDrawer' });
  const [t] = useTranslateLoader(prefixPN('chatListDrawer'));
  const [store, render] = useStore({ rooms: [], intermediateRooms: [] });
  const isStudent = useIsStudent();
  const isTeacher = useIsTeacher();

  function onKim() {}

  async function onMutedChanged(muted) {
    await RoomService.saveConfig({ muted });
    store.config.muted = muted;
    render();
  }

  function recalcule() {
    store.rooms = _.orderBy(getRoomsByParent(store.originalRooms), ['attached'], ['asc']);
    if (!store.centerConfig?.enableStudentsChats) {
      store.rooms = _.filter(store.rooms, (room) => !isStudentsChatRoom(room));
    }
    if (store.centerConfig?.disableChatsBetweenStudentsAndTeachers) {
      store.rooms = _.filter(store.rooms, (room) => !isStudentTeacherChatRoom(room));
    }
    store.rooms = _.filter(store.rooms, (room) => {
      if (
        room.type === 'plugins.academic-portfolio.class' &&
        !store.programConfig[room.program]?.enableSubjectsRoom
      ) {
        return false;
      }
      if (room.type === 'group') {
        if (!store.centerConfig?.enableStudentsCreateGroups) {
          let oneAdminIsStudent = false;
          _.forEach(room.userAgents, (item) => {
            if (item.isAdmin && item.userAgent.profile.sysName === 'student') {
              oneAdminIsStudent = true;
              return false;
            }
          });
          if (oneAdminIsStudent) return false;
        }
      }
      return true;
    });

    store.roomTypes = _.uniq(_.map(store.rooms, 'type'));
    if (store.intermediateRooms?.length) {
      const interm = [];
      _.forEach(store.intermediateRooms, (room) => {
        const r = _.find(store.rooms, { id: room.id });
        interm.push({
          ...r,
          childrens: getRoomChildrens(store.originalRooms, room),
          unreadMessages: getTotalUnreadMessages(room.childrens, store.originalRooms),
        });
      });
      store.intermediateRooms = interm;
    }
    if (store.typeFilters?.length) {
      store.rooms = _.filter(store.rooms, (room) => store.typeFilters.includes(room.type));
    }
    if (store.nameFilter?.length) {
      store.rooms = _.filter(store.rooms, (room) => {
        if (room.name) {
          if (
            t(room.name, room.nameReplaces, false, room.name)
              .toLowerCase()
              .includes(store.nameFilter.toLowerCase())
          ) {
            return true;
          }
        }
        if (room.subName) {
          if (
            t(room.subName, {}, false, room.subName)
              .toLowerCase()
              .includes(store.nameFilter.toLowerCase())
          ) {
            return true;
          }
        }
        return false;
      });
    }
  }

  function onClickRoom(room) {
    const childrens = getRoomChildrens(store.originalRooms, room);
    if (childrens.length) {
      store.canOpenIntermediateDrawer = false;
      store.intermediateRooms.push({
        ...room,
        childrens,
        unreadMessages: getTotalUnreadMessages(childrens, store.originalRooms),
      });
      render();
      // Esperamos para que se renderize y despues se ponga el opened a true y asi se anime
      setTimeout(() => {
        store.canOpenIntermediateDrawer = true;
        render();
      }, 10);
    } else {
      store.selectedRoom = room;
      onRoomOpened(room);
      render();
    }
  }

  async function load() {
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
    store.centerConfig = centerConfig;
    store.originalRooms = originalRooms;
    store.config = config;
    recalcule();
    if (store.openAfterLoad) {
      const r = _.find(store.rooms, { key: store.openAfterLoad });
      onClickRoom(r);
      store.openAfterLoad = null;
    }
    render();
  }

  function goBackIntermediateRoom() {
    store.canOpenIntermediateSecondDrawer = false;
    if (store.intermediateRooms.length > 1) {
      store.canOpenIntermediateSecondDrawer = true;
    }
    store.canOpenIntermediateDrawer = false;
    render();
    // Esperamos a borrarlo para que se anime el que se cierra
    setTimeout(() => {
      store.canOpenIntermediateSecondDrawer = false;
      store.intermediateRooms.pop();
    }, 500);
  }

  function closeAll() {
    store.createType = null;
    store.selectedRoom = null;
    store.canOpenIntermediateDrawer = false;
    onRoomOpened(null);
    onClose();
    render();
    // Esperamos a borrarlo para que se anime el que se cierra
    setTimeout(() => {
      store.intermediateRooms = [];
      render();
    }, 300);
  }

  function closeSelectedRoom() {
    store.selectedRoom = null;
    onRoomOpened(null);
    render();
  }

  function onCloseRoom() {
    closeAll();
  }

  function onCloseIntermediate() {
    closeAll();
  }

  function onChangeNameFilter(e) {
    store.nameFilter = e;
    recalcule();
    render();
  }

  function onChangeTypeFilters(e) {
    store.typeFilters = e;
    recalcule();
    render();
  }

  function cleanTypesFilter() {
    store.typeFilters = [];
    recalcule();
    render();
  }

  function onBeforeNewGroup() {
    store.openNextAddedRoomType = 'group';
  }

  function hideCreate() {
    store.createType = null;
    render();
  }

  function closeCreate() {
    closeAll();
  }

  function newChat() {
    store.createType = 'chat';
    render();
  }

  function newGroup() {
    store.createType = 'group';
    render();
  }

  async function onNewChat(e) {
    store.openNextAddedRoomType = 'chat';
    await RoomService.createRoom({
      type: 'chat',
      userAgents: [e.id, getCentersWithToken()[0].userAgentId],
    });
    hideCreate();
  }

  React.useEffect(() => {
    load();
  }, []);

  const disabledProfilesForNewChat = React.useMemo(() => {
    const profiles = [];
    if (!store.centerConfig?.enableStudentsChats && isStudent) {
      profiles.push('student');
    }
    if (store.centerConfig?.disableChatsBetweenStudentsAndTeachers && (isStudent || isTeacher)) {
      profiles.push(isStudent ? 'teacher' : 'student');
    }
    return profiles;
  }, [store.centerConfig, isStudent, isTeacher]);

  const disabledProfilesForNewGroup = React.useMemo(() => {
    const profiles = [...disabledProfilesForNewChat];
    if (isStudent && !store.centerConfig?.studentsCanAddTeachersToGroups) {
      profiles.push('teacher');
    }
    return profiles;
  }, [disabledProfilesForNewChat]);

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
      if (store.programConfig?.[data.program]) {
        store.programConfig[data.program] = data.config;
        recalcule();
        render();
      }
      return;
    }
    if (event === 'COMUNICA:ROOM:ADDED') {
      console.log(store.openNextAddedRoomType);
      if (store.openNextAddedRoomType) {
        if (data.room.includes(`leemons.comunica.room.${store.openNextAddedRoomType}`)) {
          store.openAfterLoad = data.room;
        }
      }
      store.openNextAddedRoomType = null;
      debouncedFunction(load);
      return;
    }
    if (event === 'COMUNICA:ROOM:USER_ADDED') {
      const index = _.findIndex(store.originalRooms, { key: data.key });
      if (index >= 0) {
        const i = _.findIndex(
          store.originalRooms[index].userAgents,
          (item) => item.userAgent.id === data.userAgent.userAgent.id
        );
        if (i >= 1) {
          store.originalRooms[index].userAgents[i] = data.userAgent;
        } else {
          store.originalRooms[index].userAgents.push(data.userAgent);
        }
        debouncedFunction2(() => {
          recalcule();
          render();
        });
      }
      return;
    }
    if (event === 'COMUNICA:CONFIG:ROOM') {
      const index = _.findIndex(store.originalRooms, { key: data.room });
      if (index >= 0) {
        store.originalRooms[index].muted = !!data.muted;
        store.originalRooms[index].attached = data.attached;
        recalcule();
        render();
      }
      return;
    }
    if (event === 'COMUNICA:ROOM:REMOVE') {
      const index = _.findIndex(store.originalRooms, { key: data.key });
      if (index >= 0) {
        store.originalRooms.splice(index, 1);
        recalcule();
        render();
      }
      return;
    }
    if (event === 'COMUNICA:ROOM:USERS_REMOVED') {
      const index = _.findIndex(store.originalRooms, { key: data.room });
      if (index >= 0) {
        store.originalRooms[index].userAgents = _.map(
          store.originalRooms[index].userAgents,
          (item) => {
            let { deleted } = item;
            if (data.userAgents.includes(item.userAgent.id)) deleted = true;
            return {
              ...item,
              deleted,
            };
          }
        );
        recalcule();
        render();
      }
      return;
    }
    if (event === 'COMUNICA:ROOM:UPDATE:NAME') {
      const index = _.findIndex(store.originalRooms, { key: data.key });
      if (index >= 0) {
        store.originalRooms[index].name = data.name;
        recalcule();
        render();
      }
      return;
    }
    if (event === 'COMUNICA:ROOM:UPDATE:IMAGE') {
      const index = _.findIndex(store.originalRooms, { key: data.key });
      if (index >= 0) {
        store.originalRooms[index].image = data.image;
        if (!store.originalRooms[index].imageSeed) store.originalRooms[index].imageSeed = 0;
        store.originalRooms[index].imageSeed++;
        recalcule();
        render();
      }
      return;
    }
    _.forEach(store.originalRooms, (room, index) => {
      if (`COMUNICA:ROOM:${room.key}` === event) {
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

  React.useEffect(() => {
    if (openRoom) {
      onClickRoom(openRoom);
    }
  }, [openRoom]);

  store.roomNewChat = React.useMemo(() => {
    const agents = [];
    _.forEach(store.originalRooms, (room) => {
      if (room.type === 'chat') {
        agents.push(getChatUserAgent(room.userAgents));
      }
    });
    return {
      userAgents: [
        ...agents,
        {
          deleted: false,
          userAgent: {
            id: getCentersWithToken()[0].userAgentId,
          },
        },
      ],
    };
  }, [store.originalRooms]);

  let canAddGroup = true;
  if (isStudent) {
    canAddGroup = false;
    if (store.centerConfig?.enableStudentsCreateGroups) canAddGroup = true;
  }

  return (
    <>
      <Drawer
        opened={
          opened &&
          !store.selectedRoom &&
          (!store.intermediateRooms.length ||
            (!store.canOpenIntermediateSecondDrawer &&
              !store.canOpenIntermediateDrawer &&
              store.intermediateRooms.length))
        }
        size={430}
        close={false}
        empty
      >
        <Box className={classes.wrapper}>
          <Box className={classes.header}>
            {/* <ActionButton onClick={onKim} icon={<PluginKimIcon width={16} height={16} />} />
             */}
            <Box></Box>
            <Box className={classes.headerRight}>
              <Switch label={t('focus')} checked={store.config?.muted} onChange={onMutedChanged} />
              <Popover
                target={
                  <ActionButton
                    onClick={onClose}
                    icon={<PluginSettingsIcon width={16} height={16} />}
                  />
                }
              >
                <Box className={classes.config}>
                  <Button onClick={newChat} fullWidth variant="light" color="secondary">
                    {t('newChat')}
                  </Button>
                  {canAddGroup ? (
                    <Button onClick={newGroup} fullWidth variant="light" color="secondary">
                      {t('newGroup')}
                    </Button>
                  ) : null}
                </Box>
              </Popover>
              <ActionButton onClick={onClose} icon={<RemoveIcon width={16} height={16} />} />
            </Box>
          </Box>
          <Box className={classes.title}>
            <Title order={3}>{t('myConversations')}</Title>
          </Box>
          <Box className={classes.input}>
            <TextInput
              value={store.nameFilter}
              onChange={onChangeNameFilter}
              placeholder={t('search')}
              icon={<SearchIcon width={16} height={16} />}
              rightSection={
                store.roomTypes ? (
                  <Popover target={<ActionButton icon={<FilterIcon width={16} height={16} />} />}>
                    <Box className={classes.filterContainer}>
                      <CheckBoxGroup
                        orientation="vertical"
                        direction="column"
                        onChange={onChangeTypeFilters}
                        data={store.roomTypes.map((type) => ({
                          label: t(type.replace(/\./g, '_')),
                          value: type,
                          checked: store.typeFilters?.includes(type),
                        }))}
                      />
                    </Box>
                    <Box className={classes.filterClean}>
                      <Button onClick={cleanTypesFilter} fullWidth size="sm">
                        {t('clean')}
                      </Button>
                    </Box>
                  </Popover>
                ) : null
              }
            />
          </Box>
          <Box className={classes.listItems}>
            {store.rooms.map((room) => (
              <ChatListDrawerItem
                key={room.id}
                t={t}
                room={room}
                onClick={() => onClickRoom(room)}
              />
            ))}
          </Box>
        </Box>
      </Drawer>

      {store.intermediateRooms.map((room, index) => {
        let open = store.intermediateRooms.length - 1 === index;
        if (!store.canOpenIntermediateDrawer) {
          open = false;
        }
        if (store.canOpenIntermediateSecondDrawer) {
          open = store.intermediateRooms.length - 2 === index;
        }
        return (
          <ChatListDrawerIntermediate
            key={room.id}
            room={room}
            t={t}
            opened={open && !store.selectedRoom}
            onClickRoom={onClickRoom}
            onReturn={goBackIntermediateRoom}
            onClose={onCloseIntermediate}
          />
        );
      })}
      <ChatDrawer
        onClose={onCloseRoom}
        onReturn={closeSelectedRoom}
        room={store.selectedRoom?.key}
        opened={!!store.selectedRoom}
      />
      <ChatInfoDrawer
        opened={store.createType === 'group' && canAddGroup}
        disabledProfiles={disabledProfilesForNewGroup}
        onBeforeNewGroup={onBeforeNewGroup}
        onReturn={hideCreate}
        onClose={closeCreate}
      />
      <ChatAddUsersDrawer
        newChatMode
        disabledProfiles={disabledProfilesForNewChat}
        room={store.roomNewChat}
        opened={store.createType === 'chat'}
        onSave={onNewChat}
        onReturn={hideCreate}
        onClose={closeCreate}
      />
    </>
  );
}

ChatListDrawer.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  openRoom: PropTypes.any,
  onRoomOpened: PropTypes.func,
};

export { ChatListDrawer };
export default ChatListDrawer;
