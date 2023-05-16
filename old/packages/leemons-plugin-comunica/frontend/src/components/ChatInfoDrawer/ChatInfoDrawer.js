import {
  ActionButton,
  Box,
  Button,
  Drawer,
  Switch,
  TextInput,
  UserDisplayItem,
} from '@bubbles-ui/components';
import { ChevDownIcon, ChevronLeftIcon, ChevUpIcon, RemoveIcon } from '@bubbles-ui/icons/outline';
import { DeleteBinIcon, VolumeControlOffIcon } from '@bubbles-ui/icons/solid';
import { useStore } from '@common';
import ChatAddUsersDrawer from '@comunica/components/ChatAddUsersDrawer/ChatAddUsersDrawer';
import RoomHeader from '@comunica/components/RoomHeader/RoomHeader';
import prefixPN from '@comunica/helpers/prefixPN';
import RoomService from '@comunica/RoomService';
import getBase64 from '@leebrary/helpers/getBase64';
import SocketIoService from '@mqtt-socket-io/service';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import getUserAgentsInfo from '@users/request/getUserAgentsInfo';
import { getCentersWithToken } from '@users/session';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { ChatInfoDrawerStyles } from './ChatInfoDrawer.styles';

const usersToShow = 7;

function ChatInfoDrawer({
  room,
  opened,
  disabledProfiles,
  onBeforeNewGroup = () => {},
  onReturn = () => {},
  onClose = () => {},
}) {
  const { classes } = ChatInfoDrawerStyles({}, { name: 'ChatDrawer' });
  const [t] = useTranslateLoader(prefixPN('chatListDrawer'));

  const [store, render] = useStore({
    showMembers: false,
    name: room ? t(room.name, room.nameReplaces, null, room.name) : null,
    muted: room?.muted || false,
    attached: room?.attached || false,
    adminDisableMessages: room?.adminDisableMessages || false,
    createUserAgents: [],
  });

  async function toggleMute() {
    store.muted = !store.muted;
    render();
    if (room) {
      const { muted } = await RoomService.toggleRoomMute(room.key);
      if (store.muted !== muted) {
        store.muted = muted;
        render();
      }
    }
  }

  function reset() {
    store.adminDisableMessages = false;
    store.attached = false;
    store.muted = false;
    store.showAllMembers = false;
    store.name = null;
    store.createUserAgents = [];
    store.nameError = false;
    store.createFile = null;
    store.file = null;
  }

  async function toggleAttached() {
    store.attached = store.attached ? null : new Date();
    render();
    if (room) await RoomService.toggleRoomAttached(room.key);
  }

  async function toggleAdminDisableMessages() {
    store.adminDisableMessages = !store.adminDisableMessages;
    render();
    if (room) await RoomService.adminDisableMessages(room.key);
  }

  function toggleShowAllMembers() {
    store.showAllMembers = !store.showAllMembers;
    render();
  }

  function deleteUserFromRoom(userAgent) {
    if (room) {
      RoomService.adminRemoveUserAgentFromRoom(room.key, userAgent.id);
    } else {
      const index = _.findIndex(store.createUserAgents, { id: userAgent.id });
      if (index >= 0) {
        store.createUserAgents.splice(index, 1);
        render();
      }
    }
  }

  function muteAdminUserFromRoom(userAgent) {
    RoomService.toggleAdminRoomMute(room.key, userAgent.id);
  }

  function onNameChange(name) {
    store.name = name;
    store.nameError = !store.name;
    render();
  }

  function updateName() {
    RoomService.adminUpdateRoomName(room.key, store.name);
  }

  function closeAddUsers() {
    store.showAddUsers = false;
    render();
    onClose();
  }

  function addUsers(e) {
    store.createUserAgents = [...store.createUserAgents, ...e];
    render();
  }

  function returnAddUsers() {
    store.showAddUsers = false;
    render();
  }

  function openAddUsers() {
    store.showAddUsers = true;
    render();
  }

  function removeRoom() {
    RoomService.adminRemoveRoom(room.key);
  }

  async function createGroup() {
    onBeforeNewGroup();
    const {
      room: { key },
    } = await RoomService.createRoom({
      name: store.name,
      type: 'group',
      userAgents: _.map(store.createUserAgents, 'id'),
    });
    if (store.adminDisableMessages) RoomService.adminDisableMessages(key);
    if (store.attached) RoomService.toggleRoomAttached(key);
    if (store.muted) RoomService.toggleRoomMute(key);
    if (store.file) RoomService.adminChangeRoomImage(key, store.file);
    onReturn();
    reset();
    render();
  }

  async function onImageChange(file) {
    if (!room) {
      store.createFile = await getBase64(file);
      store.file = file;
    } else {
      RoomService.adminChangeRoomImage(room.key, file);
    }
  }

  async function load() {
    const {
      userAgents: [item],
    } = await getUserAgentsInfo(getCentersWithToken()[0].userAgentId, { withProfile: true });
    store.me = item;
    render();
  }

  async function loadConfig() {
    store.programConfig = null;
    if (room?.program) {
      store.programConfig = await RoomService.getProgramConfig(room?.program);
    }
    render();
  }

  function beforeReturn() {
    onReturn();
    if (!room) {
      reset();
      render();
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  React.useEffect(() => {
    loadConfig();
  }, [room?.id]);

  React.useEffect(() => {
    if (room) {
      if (store.muted !== room.muted) {
        store.muted = room.muted;
        render();
      }
    }
  }, [room?.muted]);

  React.useEffect(() => {
    if (room) {
      if (store.adminDisableMessages !== room.adminDisableMessages) {
        store.adminDisableMessages = room.adminDisableMessages;
        render();
      }
    }
  }, [room?.adminDisableMessages]);

  React.useEffect(() => {
    if (room) {
      if (store.attached !== room.attached) {
        store.attached = room.attached;
        render();
      }
    }
  }, [room?.attached]);

  let headerRoom = room;
  if (!room) {
    headerRoom = {
      name: store.name || t('newGroupName'),
      type: 'group',
      imageIsUrl: true,
      image: store.createFile,
      userAgents: _.map(store.createUserAgents, (item) => ({
        userAgent: item,
        deleted: false,
      })),
    };
    if (store.me) {
      headerRoom.userAgents.unshift({
        deleted: false,
        isAdmin: true,
        userAgent: store.me,
      });
    }
  }

  if (headerRoom?.userAgents) {
    store.userAgents = _.filter(headerRoom?.userAgents, (e) => !e.deleted);
    store.nNoDeletedAgents = store.userAgents.length;
    if (!store.showAllMembers) {
      store.userAgents = store.userAgents.slice(0, usersToShow);
    }
  }

  let saveDisabled = store.name === room?.name || store.nameError || !store.name;
  if (!room && headerRoom.userAgents.length < 2) saveDisabled = true;

  SocketIoService.useOnAny((event, data) => {
    if (event === 'COMUNICA:CONFIG:PROGRAM') {
      if (room?.program === data.program) {
        store.programConfig = data.config;
        render();
      }
    }
  });

  return (
    <>
      <Drawer opened={opened} size={430} close={false} empty>
        <Box className={classes.wrapper}>
          <Box className={classes.header}>
            <Button
              variant="link"
              color="secondary"
              onClick={beforeReturn}
              leftIcon={<ChevronLeftIcon width={12} height={12} />}
            >
              {t('return')}
            </Button>
            <ActionButton onClick={onClose} icon={<RemoveIcon width={16} height={16} />} />
          </Box>
          <Box sx={(theme) => ({ paddingBottom: theme.spacing[2] })}>
            <RoomHeader onImageChange={onImageChange} t={t} room={headerRoom} />
          </Box>
          <Box className={classes.content}>
            {!room || (room?.isAdmin && room?.type === 'group') ? (
              <Box className={classes.name}>
                <TextInput
                  required
                  label={t('groupName')}
                  error={store.nameError ? t('nameRequired') : null}
                  value={store.name}
                  onChange={onNameChange}
                />
              </Box>
            ) : null}

            <Switch checked={!!store.attached} onChange={toggleAttached} label={t('setRoom')} />
            <Switch checked={!!store.muted} onChange={toggleMute} label={t('muteRoom')} />
            {store.programConfig?.teachersCanDisableSubjectsRooms &&
            room?.type === 'plugins.academic-portfolio.class' &&
            room?.isAdmin ? (
              <Switch
                checked={!!store.adminDisableMessages}
                onChange={toggleAdminDisableMessages}
                label={t('adminDisableMessages')}
              />
            ) : null}

            <Box className={classes.participants}>
              {t('participants')} ({store.nNoDeletedAgents})
            </Box>
            {store.userAgents?.map((item) => (
              <Box key={item.userAgent.id} className={classes.userInfo}>
                <UserDisplayItem {...item.userAgent.user} size="xs" />
                {/* eslint-disable-next-line no-nested-ternary */}
                {item.isAdmin ? (
                  <Box className={classes.userAdmin}>{t('admin')}</Box>
                ) : !room || room?.isAdmin ? (
                  <Box className={classes.adminIcons}>
                    {room &&
                    (!store.programConfig ||
                      item.adminMuted ||
                      store.programConfig.teachersCanMuteStudents) ? (
                      <Box
                        className={
                          item.adminMuted ? classes.userMuteIconActive : classes.userMuteIcon
                        }
                      >
                        <ActionButton
                          onClick={() => muteAdminUserFromRoom(item.userAgent)}
                          icon={<VolumeControlOffIcon width={16} height={16} />}
                        />
                      </Box>
                    ) : null}

                    {room?.type === 'group' ? (
                      <Box className={classes.userRemove}>
                        <ActionButton
                          color="phatic"
                          onClick={() => deleteUserFromRoom(item.userAgent)}
                          icon={<DeleteBinIcon width={16} height={16} />}
                        />
                      </Box>
                    ) : null}
                  </Box>
                ) : null}
              </Box>
            ))}
            {headerRoom?.userAgents.length > usersToShow ? (
              <Box onClick={toggleShowAllMembers} className={classes.showAll}>
                {store.showAllMembers ? (
                  <>
                    <ChevUpIcon /> {t('showLess')}
                  </>
                ) : (
                  <>
                    <ChevDownIcon /> {t('showAll')}
                  </>
                )}
              </Box>
            ) : null}

            {!room || (room?.isAdmin && room?.type === 'group') ? (
              <Box onClick={openAddUsers} className={classes.showAll}>
                + {t('addNewUsers')}
              </Box>
            ) : null}
          </Box>
          {!room || (room?.isAdmin && room?.type === 'group') ? (
            <Box className={classes.buttonActions}>
              {room ? (
                <Button onClick={removeRoom} variant="outline">
                  {t('remove')}
                </Button>
              ) : null}

              <Button disabled={saveDisabled} onClick={room ? updateName : createGroup}>
                {t('save')}
              </Button>
            </Box>
          ) : null}
        </Box>
      </Drawer>
      <ChatAddUsersDrawer
        room={headerRoom}
        disabledProfiles={disabledProfiles}
        onSave={room ? null : addUsers}
        opened={store.showAddUsers}
        onClose={closeAddUsers}
        onReturn={returnAddUsers}
      />
    </>
  );
}

ChatInfoDrawer.propTypes = {
  room: PropTypes.string,
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onReturn: PropTypes.func,
  onBeforeNewGroup: PropTypes.func,
  disabledProfiles: PropTypes.array,
};

export { ChatInfoDrawer };
export default ChatInfoDrawer;
