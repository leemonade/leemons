import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ActionButton,
  Badge,
  Box,
  Drawer,
  IconButton,
  TextInput,
  UserDisplayItemList,
} from '@bubbles-ui/components';
import { AddCircleIcon, MoveRightIcon, SendMessageIcon } from '@bubbles-ui/icons/outline';
import { isFunction } from 'lodash';
import { MembersList } from '../components';
import { ChatDrawerStyles } from './ChatDrawer.styles';

function ChatDrawer({ opened, onClose }) {
  const { classes } = ChatDrawerStyles({}, { name: 'ChatDrawer' });
  const [openMembersList, setOpenMembersList] = useState(false);

  const onCloseHandler = () => {
    isFunction(onClose) && onClose();
  };

  return (
    <Drawer opened={opened} size={openMembersList ? 721 : 360} close={false} empty>
      <Box className={classes.wrapper}>
        <MembersList opened={openMembersList} onClose={() => setOpenMembersList(false)} />
        <Box className={classes.chatWrapper}>
          <Box className={classes.header}>
            <UserDisplayItemList
              limit={0}
              notExpandable
              onExpand={() => setOpenMembersList(true)}
              onShrink={() => setOpenMembersList(false)}
              data={[
                {
                  name: 'Juan',
                  surnames: 'Perez',
                  avatar:
                    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
                },
                {
                  name: 'Juan',
                  surnames: 'Perez',
                  avatar:
                    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
                },
                {
                  name: 'Juan',
                  surnames: 'Perez',
                  avatar:
                    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
                },
                {
                  name: 'Juan',
                  surnames: 'Perez',
                  avatar:
                    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
                },
                {
                  name: 'Juan',
                  surnames: 'Perez',
                  avatar:
                    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
                },
                {
                  name: 'Juan',
                  surnames: 'Perez',
                  avatar:
                    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
                },
              ]}
            />
            <ActionButton
              onClick={onCloseHandler}
              icon={<MoveRightIcon width={16} height={16} />}
            />
          </Box>
          <Box className={classes.messages}>
            <Box>
              <Badge label="Lun, 19 de jul" closable={false} size="md" />
            </Box>
          </Box>
          <Box className={classes.sendMessage}>
            <IconButton
              icon={<AddCircleIcon height={16} width={16} className={classes.addIcon} />}
              rounded
            />
            <TextInput name="message" placeholder="Escribe un nuevo mensaje" style={{ flex: 1 }} />
            <IconButton icon={<SendMessageIcon />} color="primary" rounded />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

ChatDrawer.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func,
};

export { ChatDrawer };
export default ChatDrawer;
