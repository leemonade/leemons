import React from 'react';
import {
  ActionButton,
  Box,
  Drawer,
  Popover,
  Switch,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import { FilterIcon, PluginKimIcon, RemoveIcon, SearchIcon } from '@bubbles-ui/icons/outline';
import PropTypes from 'prop-types';
import { useLocale, useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@comunica/helpers/prefixPN';
import ChatListDrawerItem from '@comunica/components/ChatListDrawerItem/ChatListDrawerItem';
import SocketIoService from '@socket-io/service';
import _ from 'lodash';
import { ChatListDrawerStyles } from './ChatListDrawer.styles';
import { RoomService } from '../../RoomService';
import ChatDrawer from '../ChatDrawer/ChatDrawer';

function ChatListDrawer({ opened, onClose = () => {} }) {
  const { classes } = ChatListDrawerStyles({}, { name: 'ChatListDrawer' });
  const [t] = useTranslateLoader(prefixPN('chatListDrawer'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const locale = useLocale();
  const scrollRef = React.useRef();
  const [store, render] = useStore({ rooms: [] });

  function scrollToBottom() {
    if (scrollRef.current) scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
  }

  function onKim() {}

  async function onMutedChanged(muted) {
    await RoomService.saveConfig({ muted });
    store.config.muted = muted;
    render();
  }

  async function load() {
    store.rooms = await RoomService.getRoomsList();
    store.config = await RoomService.getConfig();
    render();
  }

  function onClickRoom(room) {
    store.selectedRoom = room;
    render();
  }

  function onCloseRoom() {
    store.selectedRoom = null;
    render();
  }

  React.useEffect(() => {
    load();
  }, []);

  SocketIoService.useOnAny((event) => {
    _.forEach(store.rooms, (room, index) => {
      if (`COMUNICA:ROOM:${room.key}` === event) {
        store.rooms[index].unreadMessages += 1;
        render();
        return false;
      }
      if (`COMUNICA:ROOM:READED:${room.key}` === event) {
        store.rooms[index].unreadMessages = 0;
        render();
        return false;
      }
    });
  });

  return (
    <>
      <Drawer opened={opened && !store.selectedRoom} size={360} close={false} empty>
        <Box className={classes.wrapper}>
          <Box className={classes.header}>
            <ActionButton onClick={onKim} icon={<PluginKimIcon width={16} height={16} />} />
            <Box className={classes.headerRight}>
              <Switch label={t('focus')} checked={store.config?.muted} onChange={onMutedChanged} />
              <ActionButton onClick={onClose} icon={<RemoveIcon width={16} height={16} />} />
            </Box>
          </Box>
          <Box className={classes.title}>
            <Title order={3}>{t('myConversations')}</Title>
          </Box>
          <Box className={classes.input}>
            <TextInput
              placeholder={t('search')}
              icon={<SearchIcon width={16} height={16} />}
              rightSection={
                <Popover target={<ActionButton icon={<FilterIcon width={16} height={16} />} />}>
                  <Box style={{ padding: 8 }}>I'm a popover</Box>
                </Popover>
              }
            />
          </Box>
          <Box>
            {store.rooms.map((room) => (
              <ChatListDrawerItem key={room.id} room={room} onClick={() => onClickRoom(room)} />
            ))}
          </Box>
        </Box>
      </Drawer>
      <ChatDrawer
        onClose={onCloseRoom}
        room={store.selectedRoom?.key}
        opened={!!store.selectedRoom}
      />
    </>
  );
}

ChatListDrawer.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func,
};

export { ChatListDrawer };
export default ChatListDrawer;
