import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  ActionButton,
  Box,
  Button,
  Checkbox,
  Drawer,
  TextInput,
  useDebouncedCallback,
  UserDisplayItem,
} from '@bubbles-ui/components';
import { ChevronLeftIcon, RemoveIcon, SearchIcon } from '@bubbles-ui/icons/outline';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { useStore } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@comunica/helpers/prefixPN';
import { searchUserAgentsRequest } from '@users/request';
import { getCentersWithToken } from '@users/session';
import RoomService from '@comunica/RoomService';
import { ChatAddUsersDrawerStyles } from './ChatAddUsersDrawer.styles';

function ChatAddUsersDrawer({
  room,
  opened,
  newChatMode,
  onSave,
  disabledProfiles = [],
  onReturn = () => {},
  onClose = () => {},
}) {
  const { classes } = ChatAddUsersDrawerStyles({}, { name: 'ChatDrawer' });
  const [t] = useTranslateLoader(prefixPN('chatListDrawer'));

  const debouncedFunction = useDebouncedCallback(300);
  const [store, render] = useStore({ usersToAddIds: [], usersToAdd: [], userAgents: [] });

  function deleteUser(index) {
    store.usersToAdd.splice(index, 1);
    store.usersToAddIds = _.map(store.usersToAdd, 'id');
    render();
  }

  async function search() {
    const filters = {
      user: {
        name: store.nameFilter,
        surnames: store.nameFilter,
        secondSurname: store.nameFilter,
        email: store.nameFilter,
        center: getCentersWithToken()[0].id,
      },
    };
    if (store.profileFilter) {
      filters.profile = store.profileFilter;
    }

    const { userAgents } = await searchUserAgentsRequest(filters, {
      withCenter: true,
      withProfile: true,
      onlyContacts: true,
    });

    store.allUserAgents = _.filter(userAgents, (userAgent) => {
      if (disabledProfiles.includes(userAgent.profile.sysName)) return false;
      return true;
    });

    render();
  }

  function resetAll() {
    store.usersToAdd = [];
    store.usersToAddIds = [];
    store.userAgents = [];
    store.nameFilter = '';
    store.profileFilter = null;
    search();
  }

  async function save() {
    if (_.isFunction(onSave)) {
      onSave(store.usersToAdd);
    } else {
      await RoomService.adminAddUsersToRoom(room.key, store.usersToAddIds);
    }
    onReturn();
    resetAll();
  }

  function onNameFilterChange(name) {
    store.nameFilter = name;
    debouncedFunction(search);
  }

  function toggleUserAgent(userAgent) {
    if (newChatMode) {
      onSave(userAgent);
      return;
    }
    if (store.usersToAddIds.includes(userAgent.id)) {
      const index = _.findIndex(store.usersToAdd, { id: userAgent.id });
      if (index >= 0) {
        store.usersToAdd.splice(index, 1);
      }
    } else {
      store.usersToAdd.push(userAgent);
    }
    store.usersToAddIds = _.map(store.usersToAdd, 'id');
    render();
  }

  function allAgentsSelected() {
    let result = true;
    // eslint-disable-next-line consistent-return
    _.forEach(store.userAgents, (userAgent) => {
      if (!store.usersToAddIds.includes(userAgent.id)) {
        result = false;
        return false;
      }
    });
    return result;
  }

  function selectAllAgents(value) {
    if (value) {
      _.forEach(store.userAgents, (userAgent) => {
        if (!store.usersToAddIds.includes(userAgent.id)) {
          store.usersToAdd.push(userAgent);
        }
      });
    } else {
      _.forEach(store.userAgents, (userAgent) => {
        if (store.usersToAddIds.includes(userAgent.id)) {
          const index = _.findIndex(store.usersToAdd, { id: userAgent.id });
          if (index >= 0) {
            store.usersToAdd.splice(index, 1);
          }
        }
      });
    }
    store.usersToAddIds = _.map(store.usersToAdd, 'id');
    render();
  }

  React.useEffect(() => {
    debouncedFunction(search);
  }, [room, JSON.stringify(disabledProfiles)]);

  const currentUserIds = _.map(
    _.filter(room.userAgents, (e) => !e.deleted),
    'userAgent.id'
  );

  store.userAgents = _.filter(store.allUserAgents, ({ id }) => !currentUserIds.includes(id));

  return (
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
        <Box className={classes.content}>
          <Box className={classes.title}>
            {newChatMode ? t('newPrivateChat') : t('addNewUsers')}
          </Box>
          {store.usersToAdd?.length ? (
            <Box>
              <Box className={classes.participants}>
                {t('participants')} ({store.usersToAdd.length})
              </Box>
              {store.usersToAdd?.map((item, index) => (
                <Box key={item.id} className={classes.userInfo}>
                  <UserDisplayItem {...item.user} size="xs" />
                  <Box className={classes.adminIcons}>
                    <Box className={classes.userRemove}>
                      <ActionButton
                        color="phatic"
                        onClick={() => deleteUser(index)}
                        icon={<DeleteBinIcon width={16} height={16} />}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
              <Box
                sx={(theme) => ({ marginTop: theme.spacing[3], marginBottom: theme.spacing[5] })}
              >
                <Box className={classes.line} />
              </Box>
            </Box>
          ) : null}
          <Box className={classes.searchTitle}>{t('searchTitle')}</Box>
          <TextInput
            value={store.nameFilter}
            onChange={onNameFilterChange}
            placeholder={t('search')}
            icon={<SearchIcon width={16} height={16} />}
          />
          <Box className={classes.results}>
            {t('searchResults')}({store.userAgents.length})
          </Box>
          {!newChatMode ? (
            <Box>
              <Checkbox
                checked={allAgentsSelected()}
                onChange={selectAllAgents}
                label={t('selectAll')}
              />
            </Box>
          ) : null}

          <Box className={classes.userAgents}>
            {store.userAgents.map((userAgent) => (
              <Box
                key={userAgent.id}
                onClick={() => toggleUserAgent(userAgent)}
                className={classes.userAgentItem}
              >
                {!newChatMode ? (
                  <Checkbox checked={store.usersToAddIds.includes(userAgent.id)} />
                ) : null}

                <UserDisplayItem
                  {...userAgent.user}
                  noBreak={false}
                  rol={userAgent?.profile?.name}
                  variant="rol"
                  size="md"
                />
              </Box>
            ))}
          </Box>
        </Box>
        {!newChatMode ? (
          <Box className={classes.buttonActions}>
            <Button onClick={save}>{t('add')}</Button>
          </Box>
        ) : null}
      </Box>
    </Drawer>
  );
}

ChatAddUsersDrawer.propTypes = {
  room: PropTypes.any,
  onSave: PropTypes.func,
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onReturn: PropTypes.func,
  newChatMode: PropTypes.bool,
  disabledProfiles: PropTypes.array,
};

export { ChatAddUsersDrawer };
export default ChatAddUsersDrawer;
