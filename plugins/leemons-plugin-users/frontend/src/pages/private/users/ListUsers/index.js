import React, { useEffect, useMemo } from 'react';
import _, { isBoolean, isFunction } from 'lodash';
import {
  Badge,
  Box,
  Pager,
  Stack,
  Table,
  Select,
  Button,
  TLayout,
  Checkbox,
  ImageLoader,
  SearchInput,
  ActionButton,
  LoadingOverlay,
  ContextContainer,
} from '@bubbles-ui/components';
import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { CloudUploadIcon, DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { LocaleDate, useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { activateUserRequest, getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import { useHistory } from 'react-router-dom';
import DisableUsersModal from '@users/components/DisableUsersModal';
import EnableUsersModal from '@users/components/EnableUsersModal';
import UserDetailDrawer from '@users/components/UserDetailDrawer';
import activeUserAgent from '@users/request/activeUserAgent';
import disableUserAgent from '@users/request/disableUserAgent';
import { UserAdminDrawer } from '@users/components/UserAdminDrawer';
import { ListEmptyState } from '@common/components/ListEmptyState';
import { SelectProfile } from '@users/components/SelectProfile';
import { SelectCenter } from '@users/components/SelectCenter';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { SetPasswordModal } from '@users/components/SetPasswordModal';
import { listUsersRequest } from '../../../../request';
import { BulkActionModal } from './components/BulkActionModal';

function ListUsers() {
  const [t] = useTranslateLoader(prefixPN('list_users'));
  const [store, render] = useStore({
    page: 0,
    size: 10,
    checkeds: [],
  });
  const [loadingError, LoadingErrorAlert] = useRequestErrorMessage();
  const [bulkActionInfo, setBulkActionInfo] = React.useState(null);
  const history = useHistory();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  // ····················································
  // INIT DATA LOADING

  async function listUsers(searchQuery) {
    const query = {};
    if (searchQuery ?? store.search) {
      query.$or = [
        { name: { $regex: searchQuery.toLowerCase(), $options: 'i' } },
        { surnames: { $regex: searchQuery.toLowerCase(), $options: 'i' } },
        { secondSurname: { $regex: searchQuery.toLowerCase(), $options: 'i' } },
        { email: { $regex: searchQuery.toLowerCase(), $options: 'i' } },
        { phone: { $regex: searchQuery.toLowerCase(), $options: 'i' } },
      ];
    }
    if (store.profile) {
      query.profiles = store.profile;
    }
    if (store.centerId) {
      query.centers = store.centerId;
    }
    if (store.state) {
      query.disabled = true;
      if (store.state === 'active') {
        query.disabled = false;
      }
    }

    const { data } = await listUsersRequest({
      page: store.page,
      size: store.size,
      query,
    });

    return data;
  }

  async function load(searchQuery) {
    try {
      store.loading = true;
      render();
      store.pagination = await listUsers(searchQuery);
      store.loading = false;
      render();
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.loading = false;
    render();
  }

  async function getPermissions() {
    const [{ permissions: addPermission }, { permissions: importPermission }] = await Promise.all([
      getPermissionsWithActionsIfIHaveRequest('users.users'),
      getPermissionsWithActionsIfIHaveRequest('users.import'),
    ]);
    if (addPermission) {
      store.canAdd =
        addPermission.actionNames.includes('create') || addPermission.actionNames.includes('admin');
    }
    if (importPermission) {
      store.canImport =
        importPermission.actionNames.includes('view') ||
        importPermission.actionNames.includes('update') ||
        importPermission.actionNames.includes('admin');
    }
    render();
  }

  useEffect(() => {
    getPermissions();
  }, []);

  // ····················································
  // METHODS

  function getUserStateKey(status) {
    if (status === 'created') {
      return 'statePending';
    }
    if (status === 'disabled') {
      return 'disable';
    }
    return 'active';
  }

  function filterSelectedUserAgentsByProfiles(profiles) {
    const userAgents = store.pagination?.userAgents ?? [];
    return userAgents
      .filter((ua) => store.checkeds.includes(ua.user))
      .filter((ua) => profiles.includes(ua.profile))
      .map((ua) => ua.id);
  }

  function goImportPage() {
    history.push('/private/users/import');
  }

  function makeAction(action) {
    store.actionModal = action;
    render();
  }

  async function changeSelectedUserAgentState(profiles, changeStateFunc) {
    const userAgentsToChange = filterSelectedUserAgentsByProfiles(profiles);

    if (isFunction(changeStateFunc) && userAgentsToChange.length > 0) {
      let current = 0;
      const total = userAgentsToChange.length;
      setBulkActionInfo({ state: 'init', current, total, completed: 0 });

      // Process each userAgent sequentially
      await userAgentsToChange.reduce(async (promise, userAgentId) => {
        await promise;
        current++;
        const completed = (current / total) * 100;
        setBulkActionInfo({ state: 'processing', current, total, completed });
        return changeStateFunc(userAgentId);
      }, Promise.resolve());

      setBulkActionInfo(null);
    }
    return userAgentsToChange?.length ?? 0;
  }

  async function disableSelectedUsers(profiles) {
    try {
      store.loading = true;
      store.actionModal = null;
      render();
      const updatedCount = await changeSelectedUserAgentState(profiles, disableUserAgent);
      addSuccessAlert(
        t(updatedCount === 1 ? 'disableSingleUserSuccess' : 'disableUserSuccess', {
          n: updatedCount,
        })
      );
      store.checkeds = [];
      await load();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
    store.loading = false;
    render();
  }

  async function enableSelectedUsers(profiles) {
    try {
      store.loading = true;
      store.actionModal = null;
      render();
      const updatedCount = await changeSelectedUserAgentState(profiles, activeUserAgent);
      addSuccessAlert(
        t(updatedCount === 1 ? 'enableSingleUserSuccess' : 'enableUserSuccess', {
          n: updatedCount,
        })
      );
      store.checkeds = [];
      await load();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
    store.loading = false;
    render();
  }

  async function activateUserManually(data) {
    let current = 0;
    const total = store.checkeds.length;
    setBulkActionInfo({ state: 'init', current, total, completed: 0 });

    // Process each userAgent sequentially
    await store.checkeds.reduce(async (promise, userId) => {
      await promise;
      current++;
      const completed = (current / total) * 100;
      setBulkActionInfo({ state: 'processing', current, total, completed });
      return activateUserRequest({
        id: userId,
        password: data.password,
      });
    }, Promise.resolve());

    setBulkActionInfo(null);

    store.checkeds = [];
    load();
  }

  // ····················································
  // HANDLERS

  async function handleSearchUsers(value) {
    store.search = value;
    store.isSearching = true;
    load(value);
  }

  async function handleClearFilters() {
    store.search = null;
    store.profile = null;
    store.state = null;
    store.centerId = null;
    store.pagination = null;
    store.isSearching = false;
    render();
  }

  async function handleCenterChange(centerId) {
    store.centerId = centerId;
    store.center = store.centers?.find((c) => c.id === centerId);
    load();
  }

  async function handleProfileChange(profile) {
    store.profile = profile;
    handleSearchUsers();
  }

  async function handleStateChange(state) {
    store.state = state;
    handleSearchUsers();
  }

  async function handleSearchChange(value) {
    store.search = value;
    render();
  }

  async function handleOnPageChange(page) {
    store.page = page;
    load();
  }

  async function handleOnPageSizeChange(size) {
    store.size = Number(size);
    load();
  }

  function handleOpenUserDrawer() {
    if (!store.canAdd) {
      store.openedUserDetailDrawer = true;
    } else {
      store.openedUserAdminDrawer = true;
    }
    render();
  }

  async function handleCloseUserDrawer(reload) {
    store.openedUserAdminDrawer = false;
    store.openedUserDetailDrawer = false;
    store.openUser = null;
    render();
    if (reload && isBoolean(reload)) {
      load();
    }
  }

  function handleOnLoadCenters(centers) {
    store.centers = centers;
    render();
  }

  // ····················································
  // RENDER

  const tableHeaders = useMemo(
    () => [
      {
        Header: () => (
          <Box style={{ width: '30px' }}>
            <Checkbox
              checked={store.checkeds.length === store.pagination?.items.length}
              onChange={() => {
                if (store.checkeds.length === store.pagination?.items.length) {
                  store.checkeds = [];
                } else {
                  store.checkeds = _.map(store.pagination?.items, 'id');
                }
                render();
              }}
            />
          </Box>
        ),
        accessor: 'checked',
        className: 'text-left',
      },
      {
        Header: t('surnameHeader'),
        accessor: 'surnames',
        className: 'text-left',
      },
      {
        Header: t('nameHeader'),
        accessor: 'name',
        className: 'text-left',
      },
      {
        Header: t('emailHeader'),
        accessor: 'email',
        className: 'text-left',
      },
      {
        Header: t('birthdayHeader'),
        accessor: 'birthdate',
        className: 'text-left',
      },
      {
        Header: t('stateHeader'),
        accessor: 'state',
        className: 'text-left',
      },
      {
        Header: t('tagsHeader'),
        accessor: 'tags',
        className: 'text-left',
      },
      {
        Header: '',
        accessor: 'actions',
        className: 'text-right',
      },
    ],
    [t, store.pagination, JSON.stringify(store.checkeds)]
  );

  const tableItems = useMemo(
    () =>
      _.map(store.pagination?.items ?? [], (item) => ({
        ...item,
        checked: (
          <Box style={{ width: '30px' }}>
            <Checkbox
              checked={store.checkeds.includes(item.id)}
              onChange={() => {
                const index = store.checkeds.indexOf(item.id);
                if (index >= 0) {
                  store.checkeds.splice(index, 1);
                } else {
                  store.checkeds.push(item.id);
                }
                render();
              }}
            />
          </Box>
        ),
        tags: (
          <Stack spacing={1}>
            {item.tags.map((tag) => (
              <Badge key={tag} label={tag} closable={false} />
            ))}
          </Stack>
        ),
        birthdate: <LocaleDate date={item.birthdate} />,
        state: t(getUserStateKey(item.status)),
        actions: (
          <Box style={{ textAlign: 'right', width: '100%' }}>
            <ActionButton
              onClick={() => {
                store.openUser = item;
                handleOpenUserDrawer();
              }}
              tooltip={t('view')}
              icon={<ExpandDiagonalIcon />}
            />
          </Box>
        ),
      })),
    [t, JSON.stringify(store.pagination), JSON.stringify(store.checkeds)]
  );

  return (
    <>
      <TLayout>
        <TLayout.Header
          title={t('pageTitle')}
          cancelable={false}
          icon={
            <Box sx={{ position: 'relative', width: 24, height: 24 }}>
              <ImageLoader src="/public/users/menu-icon.svg" width={18} height={18} />
            </Box>
          }
        />
        <TLayout.Content fullWidth>
          <Box>
            {store.loading ? <LoadingOverlay visible /> : null}
            <ContextContainer title={t('searchTitle')}>
              <ContextContainer direction="row">
                <SelectCenter
                  required
                  clearable={t('clearFilter')}
                  label={t('centerLabel')}
                  placeholder={t('selectPlaceholder')}
                  value={store.centerId}
                  onChange={handleCenterChange}
                  onLoadCenters={handleOnLoadCenters}
                />
                <SelectProfile
                  clearable={t('clearFilter')}
                  firstSelected={false}
                  placeholder={t('viewAll')}
                  label={t('profileLabel')}
                  value={store.profile}
                  onChange={handleProfileChange}
                  showAll={false}
                />
                <Select
                  clearable={t('clearFilter')}
                  label={t('stateLabel')}
                  placeholder={t('viewAll')}
                  data={[
                    { label: t('stateActive'), value: 'active' },
                    { label: t('stateDisabled'), value: 'disabled' },
                  ]}
                  value={store.state}
                  onChange={handleStateChange}
                />
                <SearchInput
                  label={t('searchLabel')}
                  value={store.search}
                  placeholder={t('searchPlaceholder')}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => {
                    if (e.charCode === 13 && store.centerId) {
                      handleSearchUsers(e.target.value);
                    }
                  }}
                />
                <Stack noFlex alignItems="end" spacing={2}>
                  {/*
                  <Button
                    variant="outline"
                    disabled={isEmpty(store.search?.trim())}
                    onClick={handleSearchUsers}
                  >
                    {t('searchLabel')}
                  </Button>
                  */}
                  <Button variant="link" leftIcon={<DeleteBinIcon />} onClick={handleClearFilters}>
                    {t('clearFilter')}
                  </Button>
                </Stack>
              </ContextContainer>

              <LoadingErrorAlert />

              {!store.loading && !loadingError ? (
                <Box>
                  {store.checkeds.length > 0 && (
                    <>
                      <Box style={{ width: '20%' }}>
                        <Select
                          label={t('bulkActions')}
                          disabled={!store.checkeds.length}
                          data={[
                            { label: t('activateUsers'), value: 'active' },
                            { label: t('disableUsers'), value: 'disable' },
                            { label: t('activateUserManually'), value: 'activate-manually' },
                          ]}
                          value={null}
                          onChange={makeAction}
                        />
                      </Box>
                      <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
                        {t('selectedUsers', { n: store.checkeds.length })}
                      </Box>
                    </>
                  )}
                  {/* 
                    <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
                      {tableItems?.length
                        ? t('nUsers', {
                            n: tableItems.length,
                          })
                        : ''}
                    </Box>
                  */}

                  {tableItems?.length > 0 && <Table columns={tableHeaders} data={tableItems} />}
                  {tableItems?.length === 0 && store.canAdd && (
                    <ListEmptyState
                      description={t(store.isSearching ? 'noResults' : 'emptyState')}
                      buttonLabel={t('new')}
                      onClick={handleOpenUserDrawer}
                    />
                  )}
                </Box>
              ) : null}
              {!store.loading && store.pagination?.totalPages > 1 && (
                <Stack fullWidth justifyContent="center">
                  <Pager
                    page={store.pagination?.page || 0}
                    totalPages={store.pagination?.totalPages || 0}
                    size={store.size}
                    withSize={true}
                    onChange={(val) => handleOnPageChange(val - 1)}
                    onSizeChange={handleOnPageSizeChange}
                    labels={{
                      show: t('show'),
                      goTo: t('goTo'),
                    }}
                  />
                </Stack>
              )}
            </ContextContainer>
          </Box>
        </TLayout.Content>
        <TLayout.Footer fullWidth>
          <TLayout.Footer.RightActions>
            {store.canImport && (
              <Button variant="outline" onClick={goImportPage} leftIcon={<CloudUploadIcon />}>
                {t('import')}
              </Button>
            )}
            {store.canAdd && <Button onClick={handleOpenUserDrawer}>{t('new')}</Button>}
          </TLayout.Footer.RightActions>
        </TLayout.Footer>
      </TLayout>

      {!!store.center?.id && (
        <>
          <DisableUsersModal
            users={store.checkeds}
            center={store.center}
            opened={store.actionModal === 'disable' && store.checkeds.length > 0}
            onClose={() => {
              store.actionModal = null;
              render();
            }}
            onConfirm={disableSelectedUsers}
          />

          <EnableUsersModal
            users={store.checkeds}
            center={store.center}
            opened={store.actionModal === 'active' && store.checkeds.length > 0}
            onClose={() => {
              store.actionModal = null;
              render();
            }}
            onConfirm={enableSelectedUsers}
          />

          <SetPasswordModal
            opened={store.actionModal === 'activate-manually' && store.checkeds.length > 0}
            onClose={() => {
              store.actionModal = null;
              render();
            }}
            onSave={activateUserManually}
          />

          <UserDetailDrawer
            opened={store.openedUserDetailDrawer}
            userId={store.openUser?.id}
            center={store.center}
            onClose={handleCloseUserDrawer}
          />

          <UserAdminDrawer
            center={store.center}
            user={store.openUser}
            opened={store.openedUserAdminDrawer}
            onClose={handleCloseUserDrawer}
          />

          <BulkActionModal opened={bulkActionInfo !== null} info={bulkActionInfo} />
        </>
      )}
    </>
  );
}

export default ListUsers;
