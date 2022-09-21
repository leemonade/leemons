import React from 'react';
import PropTypes from 'prop-types';
import { keyBy, map, orderBy, uniqBy } from 'lodash';
import {
  ActionButton,
  Badge,
  Box,
  ChatMessage,
  Drawer,
  IconButton,
  Textarea,
  UserDisplayItemList,
} from '@bubbles-ui/components';
import { MoveRightIcon, SendMessageIcon } from '@bubbles-ui/icons/outline';
import { useLocale, useStore } from '@common';
import RoomService from '@comunica/RoomService';
import { getUserAgentsInfoRequest } from '@users/request';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert } from '@layout/alert';
import { getCentersWithToken } from '@users/session';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@comunica/helpers/prefixPN';
import { MembersList } from '../components';
import { ChatDrawerStyles } from './ChatDrawer.styles';

function ChatDrawer({
  room,
  opened,
  onClose = () => {},
  onMessage = () => {},
  onRoomLoad = () => {},
  onMessagesMarkAsRead = () => {},
}) {
  const { classes } = ChatDrawerStyles({}, { name: 'ChatDrawer' });
  const [t] = useTranslateLoader(prefixPN('chatDrawer'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const locale = useLocale();
  const scrollRef = React.useRef();
  const [store, render] = useStore({
    showMembers: false,
  });

  function scrollToBottom() {
    if (scrollRef.current) scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
  }

  async function load() {
    store.userAgent = getCentersWithToken()[0].userAgentId;
    store.room = await store.service.getRoom();
    store.messages = await store.service.getRoomMessages();
    store.messages = orderBy(store.messages, 'created_at', 'asc');
    store.messages = map(store.messages, (message) => ({
      ...message,
      created_at: new Date(message.created_at),
    }));
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
    render();
    onRoomLoad(store.room);
    setTimeout(() => {
      scrollToBottom();
    }, 10);
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

  return (
    <Drawer opened={opened} size={360} close={false} empty>
      <MembersList
        t={t}
        userAgents={store.userAgents}
        profiles={store.profiles}
        opened={store.showMembers}
        onClose={() => {
          store.showMembers = false;
          render();
        }}
      />
      <Box className={classes.wrapper}>
        <Box className={classes.header}>
          <UserDisplayItemList
            limit={0}
            notExpandable
            expanded={store.showMembers}
            onExpand={() => {
              store.showMembers = !store.showMembers;
              render();
            }}
            onShrink={() => {
              store.showMembers = !store.showMembers;
              render();
            }}
            data={store.userAgents}
            labels={{
              showMore: t('showMore'),
              showLess: t('showLess'),
            }}
          />
          <ActionButton onClick={onClose} icon={<MoveRightIcon width={16} height={16} />} />
        </Box>
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
                    isOwn={message.userAgent === store.userAgent}
                    user={store.userAgentsById?.[message.userAgent]}
                    message={{ ...message.message, date: message.created_at }}
                  />
                </Box>
              );
              return comp;
            })}
        </Box>
        <Box className={classes.sendMessage}>
          {/*  <IconButton
                icon={<AddCircleIcon height={16} width={16} className={classes.addIcon} />}
                rounded
              /> */}

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
          <IconButton onClick={sendMessage} icon={<SendMessageIcon />} color="primary" rounded />
        </Box>
      </Box>
    </Drawer>
  );
}

ChatDrawer.propTypes = {
  room: PropTypes.string,
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onMessage: PropTypes.func,
  onRoomLoad: PropTypes.func,
  onMessagesMarkAsRead: PropTypes.func,
};

export { ChatDrawer };
export default ChatDrawer;
