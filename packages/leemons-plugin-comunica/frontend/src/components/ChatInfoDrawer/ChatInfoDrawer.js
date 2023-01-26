import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
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
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@comunica/helpers/prefixPN';
import RoomHeader from '@comunica/components/RoomHeader/RoomHeader';
import RoomService from '@comunica/RoomService';
import ChatAddUsersDrawer from '@comunica/components/ChatAddUsersDrawer/ChatAddUsersDrawer';
import { ChatInfoDrawerStyles } from './ChatInfoDrawer.styles';

const usersToShow = 7;

function ChatInfoDrawer({ room, opened, onReturn = () => {}, onClose = () => {} }) {
  const { classes } = ChatInfoDrawerStyles({}, { name: 'ChatDrawer' });
  const [t] = useTranslateLoader(prefixPN('chatListDrawer'));

  const [store, render] = useStore({
    showMembers: false,
    name: t(room.name, room.nameReplaces, null, room.name),
    muted: room.muted,
    attached: room.attached,
  });

  async function toggleMute() {
    store.muted = !store.muted;
    render();
    const { muted } = await RoomService.toggleRoomMute(room.key);
    if (store.muted !== muted) {
      store.muted = muted;
      render();
    }
  }

  async function toggleAttached() {
    store.attached = store.attached ? null : new Date();
    render();
    await RoomService.toggleRoomAttached(room.key);
  }

  function toggleShowAllMembers() {
    store.showAllMembers = !store.showAllMembers;
    render();
  }

  function deleteUserFromRoom(userAgent) {
    RoomService.adminRemoveUserAgentFromRoom(room.key, userAgent.id);
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

  function returnAddUsers() {
    store.showAddUsers = false;
    render();
  }

  function openAddUsers() {
    store.showAddUsers = true;
    render();
  }

  React.useEffect(() => {
    if (store.muted !== room.muted) {
      store.muted = room.muted;
      render();
    }
  }, [room.muted]);

  React.useEffect(() => {
    if (store.attached !== room.attached) {
      store.attached = room.attached;
      render();
    }
  }, [room.attached]);

  if (room.userAgents) {
    store.userAgents = _.filter(room.userAgents, (e) => !e.deleted);
    store.nNoDeletedAgents = store.userAgents.length;
    if (!store.showAllMembers) {
      store.userAgents = store.userAgents.slice(0, usersToShow);
    }
  }

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
            <ActionButton onClick={onClose} icon={<RemoveIcon width={16} height={16} />} />
          </Box>
          <Box sx={(theme) => ({ paddingBottom: theme.spacing[2] })}>
            <RoomHeader t={t} room={room} />
          </Box>
          <Box className={classes.content}>
            {room.isAdmin ? (
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
            <Box className={classes.participants}>
              {t('participants')} ({store.nNoDeletedAgents})
            </Box>
            {store.userAgents?.map((item) => (
              <Box key={item.userAgent.id} className={classes.userInfo}>
                <UserDisplayItem {...item.userAgent.user} size="xs" />
                {/* eslint-disable-next-line no-nested-ternary */}
                {item.isAdmin ? (
                  <Box className={classes.userAdmin}>{t('admin')}</Box>
                ) : room.isAdmin ? (
                  <Box className={classes.adminIcons}>
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
                    <Box className={classes.userRemove}>
                      <ActionButton
                        color="phatic"
                        onClick={() => deleteUserFromRoom(item.userAgent)}
                        icon={<DeleteBinIcon width={16} height={16} />}
                      />
                    </Box>
                  </Box>
                ) : null}
              </Box>
            ))}
            {room.userAgents.length > usersToShow ? (
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

            {room.isAdmin ? (
              <Box onClick={openAddUsers} className={classes.showAll}>
                + {t('addNewUsers')}
              </Box>
            ) : null}
          </Box>
          {room.isAdmin ? (
            <Box className={classes.buttonActions}>
              <Button variant="outline">{t('remove')}</Button>
              <Button disabled={store.name === room.name || store.nameError} onClick={updateName}>
                {t('save')}
              </Button>
            </Box>
          ) : null}
        </Box>
      </Drawer>
      <ChatAddUsersDrawer
        room={room}
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
};

export { ChatInfoDrawer };
export default ChatInfoDrawer;
