import React from 'react';
import {
  ActionButton,
  Box,
  Drawer,
  Popover,
  Switch,
  TextInput,
  Title,
  useDebouncedCallback,
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
import getRoomsByParent from '@comunica/helpers/getRoomsByParent';
import getRoomChildrens from '@comunica/helpers/getRoomChildrens';
import ChatListDrawerIntermediate from '@comunica/components/ChatListDrawerIntermediate/ChatListDrawerIntermediate';
import getTotalUnreadMessages from '@comunica/helpers/getTotalUnreadMessages';
import { ChatListDrawerStyles } from './ChatListDrawer.styles';
import { RoomService } from '../../RoomService';
import ChatDrawer from '../ChatDrawer/ChatDrawer';

function ChatListDrawer({ opened, onClose = () => {} }) {
  const debouncedFunction = useDebouncedCallback(100);
  const { classes } = ChatListDrawerStyles({}, { name: 'ChatListDrawer' });
  const [t] = useTranslateLoader(prefixPN('chatListDrawer'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const locale = useLocale();
  const scrollRef = React.useRef();
  const [store, render] = useStore({ rooms: [], intermediateRooms: [] });

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
    store.originalRooms = await RoomService.getRoomsList();
    store.config = await RoomService.getConfig();
    store.rooms = getRoomsByParent(store.originalRooms);
    render();
  }

  function recalcule() {
    store.rooms = getRoomsByParent(store.originalRooms);
    if (store.intermediateRooms?.length) {
      const interm = [];
      _.forEach(store.intermediateRooms, (room) => {
        interm.push({
          ...room,
          childrens: getRoomChildrens(store.originalRooms, room),
          unreadMessages: getTotalUnreadMessages(room.childrens, store.originalRooms),
        });
      });
      store.intermediateRooms = interm;
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
      render();
    }
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
    store.selectedRoom = null;
    store.canOpenIntermediateDrawer = false;
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
    render();
  }

  function onCloseRoom() {
    closeAll();
  }

  function onCloseIntermediate() {
    closeAll();
  }

  React.useEffect(() => {
    load();
  }, []);

  SocketIoService.useOnAny((event, data) => {
    if (event === 'COMUNICA:ROOM:ADDED') {
      debouncedFunction(load);
      return;
    }
    if (event === 'COMUNICA:CONFIG:ROOM') {
      const index = _.findIndex(store.originalRooms, { key: data.room });
      store.originalRooms[index].muted = !!data.muted;
      recalcule();
      render();
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
    </>
  );
}

ChatListDrawer.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func,
};

export { ChatListDrawer };
export default ChatListDrawer;
