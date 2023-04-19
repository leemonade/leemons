import {
  ActionButton,
  Badge,
  Box,
  Button,
  ChatMessage,
  Drawer,
  IconButton,
  Popover,
  Textarea,
  useDebouncedCallback,
} from '@bubbles-ui/components';
import {
  ChevronLeftIcon,
  PluginSettingsIcon,
  RemoveIcon,
  SendMessageIcon,
} from '@bubbles-ui/icons/outline';
import { useLocale, useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import ChatInfoDrawer from '@comunica/components/ChatInfoDrawer/ChatInfoDrawer';
import RoomHeader from '@comunica/components/RoomHeader/RoomHeader';
import getRoomParsed from '@comunica/helpers/getRoomParsed';
import isStudentsChatRoom from '@comunica/helpers/isStudentsChatRoom';
import isStudentTeacherChatRoom from '@comunica/helpers/isStudentTeacherChatRoom';
import isTeacherByRoom from '@comunica/helpers/isTeacherByRoom';
import prefixPN from '@comunica/helpers/prefixPN';
import RoomService from '@comunica/RoomService';
import { addErrorAlert } from '@layout/alert';
import SocketIoService from '@mqtt-socket-io/service';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getCentersWithToken } from '@users/session';
import _, { map, orderBy } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { ChatDrawerStyles } from './ChatDrawer.styles';

function ChatDrawer({
  room,
  opened,
  onReturn,
  onClose = () => {},
  onMessage = () => {},
  onRoomLoad = () => {},
  onMessagesMarkAsRead = () => {},
}) {
  const { classes } = ChatDrawerStyles({}, { name: 'ChatDrawer' });
  const [t] = useTranslateLoader(prefixPN('chatDrawer'));
  const [td] = useTranslateLoader(prefixPN('chatListDrawer'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const locale = useLocale();
  const debouncedFunction = useDebouncedCallback(300);
  const scrollRef = React.useRef();
  const [store, render] = useStore({
    showMembers: false,
  });

  function scrollToBottom() {
    if (scrollRef.current) scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
  }

  async function load() {
    store.userAgent = getCentersWithToken()[0].userAgentId;
    store.room = getRoomParsed(await store.service.getRoom());
    store.programConfig = null;
    if (store.room?.program) {
      store.programConfig = await RoomService.getProgramConfig(store.room.program);
    }
    store.messages = await store.service.getRoomMessages();
    store.messages = orderBy(store.messages, 'created_at', 'asc');
    store.messages = map(store.messages, (message) => ({
      ...message,
      created_at: new Date(message.created_at),
    }));
    store.userAgentsById = _.keyBy(_.map(store.room.userAgents, 'userAgent'), 'id');
    /*
    const { userAgents } = await getUserAgentsInfoRequest(map(store.room.userAgents, 'userAgent'), {
      withProfile: true,
    });
    const roomUserAgentsById = keyBy(store.room.userAgents, 'userAgent');
    store.userAgents = map(userAgents, (userAgent) => ({
      ...userAgent.user,
      id: userAgent.id,
      profile: userAgent.profile.id,
      roomDeleted: roomUserAgentsById[userAgent.id].deleted,
    }));
    store.userAgentsById = keyBy(store.userAgents, 'id');
    const profiles = uniqBy(userAgents, 'profile.id');
    store.profiles = map(profiles, 'profile');
    */

    render();
    onRoomLoad(store.room);
    setTimeout(() => {
      scrollToBottom();
    }, 10);
  }

  async function toggleMute() {
    store.room.muted = !store.room.muted;
    render();
    const { muted } = await store.service.toggleRoomMute();
    if (store.room.muted !== muted) {
      store.room.muted = muted;
      render();
    }
  }

  async function toggleAttached() {
    store.room.attached = store.room.attached ? null : new Date();
    render();
    await store.service.toggleRoomAttached();
  }

  function toggleInfo() {
    store.showInfo = !store.showInfo;
    render();
  }

  function closeInfo() {
    toggleInfo();
    onClose();
  }

  async function sendMessage() {
    try {
      if (store.newMessage && !store.sendingMessage) {
        store.sendingMessage = true;
        await store.service.sendMessageToRoom({
          type: 'text',
          content: store.newMessage,
        });
        store.newMessage = '';
        render();
      }
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.sendingMessage = false;
  }

  React.useEffect(() => {
    if (room) {
      store.service = new RoomService(room);
      load();
    }
  }, [room]);

  React.useEffect(() => {
    setTimeout(() => {
      if (opened) {
        scrollToBottom();
        store.service.markRoomMessagesAsRead();
        onMessagesMarkAsRead();
      }
    }, 10);
  }, [opened]);

  RoomService.watchRoom(room, (data) => {
    let _scrollToBottom = false;
    if (scrollRef.current) {
      const scrolled = scrollRef.current.scrollTop + scrollRef.current.clientHeight;
      if (scrolled > scrollRef.current.scrollHeight - 50) {
        _scrollToBottom = true;
      }
    }
    store.messages.push({
      ...data,
      created_at: new Date(data.created_at),
    });
    onMessage(data);
    render();

    if (opened) {
      store.service.markRoomMessagesAsRead();
      onMessagesMarkAsRead();
    }

    if (_scrollToBottom) {
      setTimeout(() => {
        if (scrollRef.current)
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth',
          });
      }, 10);
    }
  });

  function returnOrClose() {
    if (_.isFunction(onReturn)) {
      onReturn();
    } else {
      onClose();
    }
  }

  SocketIoService.useOnAny((event, data) => {
    if (event === 'COMUNICA:CONFIG:CENTER') {
      if (data.center === getCentersWithToken()[0].id && store.room) {
        if (!data.config.enableStudentsChats) {
          if (isStudentsChatRoom(store.room)) {
            returnOrClose();
          }
        }
        if (data.config?.disableChatsBetweenStudentsAndTeachers) {
          if (isStudentTeacherChatRoom(store.room)) {
            returnOrClose();
          }
        }
      }
      return;
    }
    if (event === 'COMUNICA:CONFIG:PROGRAM') {
      if (store.room?.program === data.program) {
        store.programConfig = data.config;
      }
      if (
        store.room?.type === 'plugins.academic-portfolio.class' &&
        store.room?.program === data.program
      ) {
        if (!data.config.enableSubjectsRoom) {
          returnOrClose();
        }
      }
      return;
    }
    if (event === 'COMUNICA:CONFIG:ROOM' && store.room?.key === data.room) {
      store.room.muted = !!data.muted;
      store.room.attached = data.attached;
      store.room.adminMuted = data.adminMuted;
      render();
    }
    if (event === 'COMUNICA:ROOM:REMOVE' && store.room?.key === data.key) {
      store.room = null;
      if (_.isFunction(onReturn)) {
        onReturn();
      } else {
        onClose();
      }
      return;
    }
    if (event === 'COMUNICA:ROOM:USER_ADDED' && store.room?.key === data.key) {
      const index = _.findIndex(
        store.room.userAgents,
        (item) => item.userAgent.id === data.userAgent.userAgent.id
      );
      if (index >= 1) {
        store.room.userAgents[index] = data.userAgent;
      } else {
        store.room.userAgents.push(data.userAgent);
      }
      store.room = getRoomParsed(store.room);
      debouncedFunction(render);
      return;
    }
    if (event === 'COMUNICA:ROOM:USERS_REMOVED' && store.room?.key === data.key) {
      store.room.userAgents = _.map(store.room.userAgents, (item) => {
        let { deleted } = item;
        if (data.userAgents.includes(item.userAgent.id)) deleted = true;
        return {
          ...item,
          deleted,
        };
      });
      store.room = getRoomParsed(store.room);
      render();
      return;
    }
    if (event === 'COMUNICA:ROOM:UPDATE:IMAGE' && store.room?.key === data.key) {
      store.room.image = data.image;
      if (!store.room.imageSeed) store.room.imageSeed = 0;
      store.room.imageSeed++;
      render();
      return;
    }
    if (event === 'COMUNICA:ROOM:UPDATE:NAME' && store.room?.key === data.key) {
      store.room.name = data.name;
      render();
      return;
    }
    if (event === 'COMUNICA:ROOM:ADMIN_MUTED' && store.room?.key === data.room) {
      const index = _.findIndex(
        store.room.userAgents,
        (item) => item.userAgent.id === data.userAgent
      );
      if (index >= 0) {
        store.room.userAgents[index].adminMuted = data.adminMuted;
        store.room.userAgents = [...store.room.userAgents];
        render();
      }
    }
    if (event === 'COMUNICA:ROOM:ADMIN_DISABLE_MESSAGES' && store.room?.key === data.room) {
      store.room.adminDisableMessages = data.adminDisableMessages;
      render();
    }
  });

  let canWrite = !store.room?.adminMuted;
  if (
    canWrite &&
    store.room?.type === 'plugins.academic-portfolio.class' &&
    store.programConfig?.onlyTeachersCanWriteInSubjectsRooms
  ) {
    canWrite = isTeacherByRoom(store.room);
  }
  if (canWrite && store.room?.adminDisableMessages && !store.room?.isAdmin) {
    canWrite = false;
  }

  return (
    <>
      <Drawer opened={opened} size={430} close={false} empty>
        <Box className={classes.wrapper}>
          <Box className={classes.header}>
            {_.isFunction(onReturn) ? (
              <Button
                variant="link"
                color="secondary"
                onClick={() => {
                  if (_.isFunction(onReturn)) onReturn();
                }}
                leftIcon={<ChevronLeftIcon width={12} height={12} />}
              >
                {td('return')}
              </Button>
            ) : (
              <Box></Box>
            )}

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
                  <Button onClick={toggleMute} fullWidth variant="light" color="secondary">
                    {store.room?.muted ? t('unmuteRoom') : t('muteRoom')}
                  </Button>
                  <Button onClick={toggleAttached} fullWidth variant="light" color="secondary">
                    {store.room?.attached ? t('unsetRoom') : t('setRoom')}
                  </Button>
                  <Button onClick={toggleInfo} fullWidth variant="light" color="secondary">
                    {t('information')}
                  </Button>
                </Box>
              </Popover>

              <ActionButton onClick={onClose} icon={<RemoveIcon width={16} height={16} />} />
            </Box>
          </Box>
          {store.room ? (
            <Box sx={(theme) => ({ paddingBottom: theme.spacing[2] })}>
              <RoomHeader t={td} room={store.room} />
            </Box>
          ) : null}
          <Box ref={scrollRef} className={classes.messages}>
            {store.messages &&
              store.messages.map((message, index) => {
                const comp = [];
                let forceUserImage = false;
                const day = new Date(message.created_at).toLocaleDateString(locale, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });
                if (index === 0 || store.lastDay !== day) {
                  store.lastDay = day;
                  forceUserImage = true;
                  comp.push(
                    <Box className={classes.date} key={`date-${index}`}>
                      <Badge label={day} closable={false} size="md" />
                    </Box>
                  );
                }
                comp.push(
                  <Box
                    key={message.id}
                    sx={(theme) => ({
                      marginTop:
                        index !== 0 && store.messages[index - 1].userAgent !== message.userAgent
                          ? theme.spacing[4]
                          : 0,
                    })}
                  >
                    <ChatMessage
                      showUser={
                        forceUserImage || index === 0
                          ? true
                          : store.messages[index - 1].userAgent !== message.userAgent
                      }
                      isTeacher={
                        store.userAgentsById?.[message.userAgent]?.profile?.sysName === 'teacher'
                      }
                      isAdmin={
                        store.userAgentsById?.[message.userAgent]?.profile?.sysName === 'admin'
                      }
                      isOwn={message.userAgent === store.userAgent}
                      user={store.userAgentsById?.[message.userAgent]?.user}
                      message={{ ...message.message, date: message.created_at }}
                    />
                  </Box>
                );
                return comp;
              })}
          </Box>
          {canWrite ? (
            <Box className={classes.sendMessage}>
              <Textarea
                value={store.newMessage}
                minRows={1}
                name="message"
                placeholder={t('writeNewMessage')}
                className={classes.textarea}
                onKeyPress={(e) => {
                  if (e.code === 'Enter' || e.charCode === 13) {
                    sendMessage();
                    e.stopPropagation();
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  store.newMessage = e;
                  render();
                }}
              />
              <IconButton
                onClick={sendMessage}
                icon={<SendMessageIcon />}
                color="primary"
                rounded
              />
            </Box>
          ) : null}
        </Box>
      </Drawer>
      {store.room ? (
        <ChatInfoDrawer
          room={store.room}
          opened={store.showInfo}
          onReturn={toggleInfo}
          onClose={closeInfo}
        />
      ) : null}
    </>
  );
}

ChatDrawer.propTypes = {
  room: PropTypes.string,
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onReturn: PropTypes.func,
  onMessage: PropTypes.func,
  onRoomLoad: PropTypes.func,
  onMessagesMarkAsRead: PropTypes.func,
};

export { ChatDrawer };
export default ChatDrawer;
