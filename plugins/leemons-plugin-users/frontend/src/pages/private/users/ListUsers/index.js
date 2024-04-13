import React, { useEffect, useMemo } from 'react';
import _, { isBoolean, isEmpty } from 'lodash';
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
import useRequestErrorMessage, { getRequestErrorMessage } from '@common/useRequestErrorMessage';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
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
import { listUsersRequest } from '../../../../request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';

function ListUsers() {
  const [t, trans] = useTranslateLoader(prefixPN('list_users'));
  const [store, render] = useStore({
    page: 0,
    size: 10,
    checkeds: [],
  });
  const { t: tCommon } = useCommonTranslate('page_header');
  const [loadingError, setLoadingError, LoadingErrorAlert] = useRequestErrorMessage();

  const history = useHistory();

  function getUserAgentId(user) {
    return _.find(store.pagination?.userAgents, { user }).id;
  }

  function getUserAgentDisabled(user) {
    return _.find(store.pagination?.userAgents, { user }).disabled;
  }

  async function listUsers() {
    const query = {};
    if (store.search) {
      query.$or = [
        { name: { $regex: store.search.toLowerCase(), $options: 'i' } },
        { surnames: { $regex: store.search.toLowerCase(), $options: 'i' } },
        { secondSurname: { $regex: store.search.toLowerCase(), $options: 'i' } },
        { email: { $regex: store.search.toLowerCase(), $options: 'i' } },
        { phone: { $regex: store.search.toLowerCase(), $options: 'i' } },
        { birthdate: { $regex: store.search.toLowerCase(), $options: 'i' } },
      ];
    }
    if (store.profile) {
      query.profiles = store.profile;
    }
    if (store.center) {
      query.centers = store.center;
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

  async function load() {
    try {
      store.loading = true;
      render();
      store.pagination = await listUsers();
      store.loading = false;
      render();
    } catch (err) {
      setLoadingError(err);
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

      store.canAdd = false;
    }
    if (importPermission) {
      store.canImport =
        importPermission.actionNames.includes('view') ||
        importPermission.actionNames.includes('update') ||
        importPermission.actionNames.includes('admin');
    }
    render();
  }

  function getUserStateKey(status) {
    if (status === 'created') {
      return 'statePending';
    }
    if (status === 'disabled') {
      return 'disable';
    }
    return 'active';
  }

  function filterUserAgentsByProfiles(profiles) {
    const userAgents = store.pagination?.userAgents ?? [];
    return userAgents.filter((ua) => profiles.includes(ua.profile));
  }

  useEffect(() => {
    // load();
    getPermissions();
  }, []);

  // ····················································
  // HANDLERS

  async function handleSearchUsers() {
    store.isSearching = true;
    load();
  }

  async function handleClearFilters() {
    store.search = null;
    store.profile = null;
    store.state = null;
    store.center = null;
    store.pagination = null;
    store.isSearching = false;
    render();
  }

  async function handleCenterChange(center) {
    store.center = center;
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

  async function onPageChange(page) {
    store.page = page;
    load();
  }

  async function onPageSizeChange(size) {
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

  function goImportPage() {
    history.push('/private/users/import');
  }

  function makeAction(action) {
    store.actionModal = action;
    render();
  }

  async function disableSelectedUsers(profiles) {
    try {
      store.loading = true;
      store.actionModal = null;
      render();
      const userAgentsToDisable = filterUserAgentsByProfiles(profiles);
      await disableUserAgent(userAgentsToDisable);
      addSuccessAlert(
        t(userAgentsToDisable.length === 1 ? 'disableSingleUserSuccess' : 'disableUserSuccess', {
          n: userAgentsToDisable.length,
        })
      );
      store.checkeds = [];
      await load();
    } catch (e) {
      setLoadingError(e);
    }
    store.loading = false;
    render();
  }

  async function enableSelectedUsers(profiles) {
    try {
      store.loading = true;
      store.actionModal = null;
      render();
      const userAgentsToEnable = filterUserAgentsByProfiles(profiles);
      await activeUserAgent(userAgentsToEnable);
      addSuccessAlert(
        t(userAgentsToEnable.length === 1 ? 'enableSingleUserSuccess' : 'enableUserSuccess', {
          n: userAgentsToEnable.length,
        })
      );
      store.checkeds = [];
      await load();
    } catch (e) {
      setLoadingError(e);
    }
    store.loading = false;
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
      store.pagination
        ? _.map(store.pagination.items, (item) => ({
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
              <Box>
                {item.tags.map((tag) => (
                  <Badge key={tag} label={tag} closable={false} />
                ))}
              </Box>
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
          }))
        : [],
    [t, store.pagination, JSON.stringify(store.checkeds)]
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
                  value={store.center}
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
                    if (e.charCode === 13 && store.center) {
                      handleSearchUsers();
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

                  {tableItems?.length > 0 && (
                    <Table
                      columns={tableHeaders}
                      data={tableItems}
                      onStyleRow={({ row, theme }) => {
                        if (getUserAgentDisabled(row.original.id)) {
                          return {
                            backgroundColor: theme.other.core.color.neutral['100'],
                          };
                        }
                        return {};
                      }}
                    />
                  )}
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
                    onChange={(val) => onPageChange(val - 1)}
                    onSizeChange={onPageSizeChange}
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
      <DisableUsersModal
        users={store.checkeds}
        center={store.centers?.find((c) => c?.id === store.center)}
        opened={store.actionModal === 'disable' && store.checkeds.length > 0}
        onClose={() => {
          store.actionModal = null;
          render();
        }}
        onConfirm={disableSelectedUsers}
      />
      <EnableUsersModal
        users={store.checkeds}
        center={store.centers?.find((c) => c?.id === store.center)}
        opened={store.actionModal === 'active' && store.checkeds.length > 0}
        onClose={() => {
          store.actionModal = null;
          render();
        }}
        onConfirm={enableSelectedUsers}
      />

      <UserDetailDrawer
        opened={store.openedUserDetailDrawer}
        userId={store.openUser?.id}
        centerId={store.center}
        onClose={handleCloseUserDrawer}
      />

      <UserAdminDrawer
        centerId={store.center}
        user={store.openUser}
        opened={store.openedUserAdminDrawer}
        onClose={handleCloseUserDrawer}
      />
    </>
  );
}

export default ListUsers;
