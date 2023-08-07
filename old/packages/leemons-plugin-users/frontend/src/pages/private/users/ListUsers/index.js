import {
  ActionButton,
  Badge,
  Box,
  Button,
  Checkbox,
  ContextContainer,
  LoadingOverlay,
  PageContainer,
  Pager,
  Paper,
  SearchInput,
  Select,
  Stack,
  Table,
} from '@bubbles-ui/components';
import { DeleteBinIcon, ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import _ from 'lodash';
import React, { useEffect, useMemo } from 'react';

import { AdminPageHeader } from '@bubbles-ui/leemons';
import { LocaleDate, useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
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
import { SelectCenter } from '../../../../components/SelectCenter';
import { SelectProfile } from '../../../../components/SelectProfile';
import { listUsersRequest } from '../../../../request';

function ListUsers() {
  const [t] = useTranslateLoader(prefixPN('list_users'));
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

  const tableHeaders = useMemo(
    () => [
      {
        Header: () => (
          <Box style={{ width: '30px' }}>
            <Checkbox
              checked={store.checkeds.length === store.pagination?.userAgents.length}
              onChange={() => {
                if (store.checkeds.length === store.pagination?.userAgents.length) {
                  store.checkeds = [];
                } else {
                  store.checkeds = _.map(store.pagination?.userAgents, 'id');
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
                  checked={store.checkeds.includes(getUserAgentId(item.id))}
                  onChange={() => {
                    const index = store.checkeds.indexOf(getUserAgentId(item.id));
                    if (index >= 0) {
                      store.checkeds.splice(index, 1);
                    } else {
                      store.checkeds.push(getUserAgentId(item.id));
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
            state: t(getUserAgentDisabled(item.id) ? 'disable' : 'active'),
            actions: (
              <Box style={{ textAlign: 'right', width: '100%' }}>
                <ActionButton
                  // as={Link}
                  // to={`/private/users/detail/${item.id}`}
                  onClick={() => {
                    store.openUser = item.id;
                    store.openedUserDrawer = true;
                    render();
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

  async function listUsers() {
    const query = {};
    if (store.search) {
      query.$or = [
        { name_$contains: store.search.toLowerCase() },
        { surnames_$contains: store.search.toLowerCase() },
        { secondSurname_$contains: store.search.toLowerCase() },
        { email_$contains: store.search.toLowerCase() },
        { phone_$contains: store.search.toLowerCase() },
        { birthdate_$contains: store.search.toLowerCase() },
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
      getPermissionsWithActionsIfIHaveRequest('plugins.users.users'),
      getPermissionsWithActionsIfIHaveRequest('plugins.users.import'),
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
    // load();
    getPermissions();
  }, []);

  const headerValues = useMemo(
    () => ({
      title: t('pageTitle'),
    }),
    [t]
  );

  async function centerChange(center) {
    store.center = center;
    render();
    // await load();
  }

  async function profileChange(profile) {
    store.profile = profile;
    render();
    // await load();
  }

  async function stateChange(state) {
    store.state = state;
    render();
    // await load();
  }

  async function searchChange(value) {
    store.search = value;
    render();
    // await load();
  }

  async function onPageChange(page) {
    store.page = page;
    await load();
  }

  async function onPageSizeChange(size) {
    store.size = Number(size);
    await load();
  }

  function goCreatePage() {
    history.push('/private/users/create');
  }

  function goImportPage() {
    history.push('/private/users/import');
  }

  function makeAction(action) {
    store.actionModal = action;
    render();
  }

  async function disableSelectedUsers() {
    try {
      store.loading = true;
      store.actionModal = null;
      render();
      await disableUserAgent(store.checkeds);
      store.checkeds = [];
      await load();
    } catch (e) {
      setLoadingError(e);
    }
    store.loading = false;
    render();
  }

  async function enableSelectedUsers() {
    try {
      store.loading = true;
      store.actionModal = null;
      render();
      await activeUserAgent(store.checkeds);
      store.checkeds = [];
      await load();
    } catch (e) {
      setLoadingError(e);
    }
    store.loading = false;
    render();
  }

  const headerButtons = React.useMemo(() => {
    const result = {};
    if (store.canAdd) result.new = tCommon('new');
    if (store.canImport) result.import = t('import');
    return result;
  }, [store.canImport, store.canAdd, t, tCommon]);

  return (
    <>
      {store.loading ? <LoadingOverlay visible /> : null}
      <ContextContainer fullHeight>
        <AdminPageHeader
          values={headerValues}
          buttons={headerButtons}
          onImport={goImportPage}
          onNew={goCreatePage}
        />
        <Paper color="solid" shadow="none" padding="none">
          <Box>
            <PageContainer noFlex>
              <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                <ContextContainer direction="row">
                  <SelectCenter
                    clearable={t('clearFilter')}
                    label={t('centerLabel')}
                    autoSelectOneOption={false}
                    value={store.center}
                    onChange={centerChange}
                  />
                  <SelectProfile
                    clearable={t('clearFilter')}
                    firstSelected={false}
                    label={t('profileLabel')}
                    value={store.profile}
                    onChange={profileChange}
                  />
                  <Select
                    clearable={t('clearFilter')}
                    label={t('stateLabel')}
                    data={[
                      { label: t('stateActive'), value: 'active' },
                      { label: t('stateDisabled'), value: 'disabled' },
                    ]}
                    value={store.state}
                    onChange={stateChange}
                  />
                  <SearchInput
                    label={t('searchLabel')}
                    value={store.search}
                    onChange={searchChange}
                    onKeyPress={(e) => {
                      if (e.charCode === 13 && store.center && store.profile) {
                        load();
                      }
                    }}
                  />
                  <Box
                    sx={(theme) => ({ alignSelf: 'end', gap: theme.spacing[2], display: 'flex' })}
                  >
                    <Button
                      variant="outline"
                      disabled={!store.center || !store.profile}
                      onClick={load}
                    >
                      {t('searchLabel')}
                    </Button>
                    <ActionButton
                      icon={<DeleteBinIcon />}
                      onClick={() => {
                        store.search = null;
                        store.profile = null;
                        store.state = null;
                        store.center = null;
                        store.pagination = null;
                        render();
                      }}
                    />
                  </Box>
                </ContextContainer>
              </Box>

              <Paper padding={2} mt={20} mb={20} fullWidth>
                <LoadingErrorAlert />
                {!store.loading && !loadingError ? (
                  <Box>
                    {store.checkeds.length ? (
                      <>
                        <Box style={{ width: 200 }}>
                          <Select
                            disabled={!store.checkeds.length}
                            placeholder={t('bulkActions')}
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
                    ) : (
                      <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
                        {store.pagination?.userAgents.length
                          ? t('nUsers', {
                              n: store.pagination?.userAgents.length,
                            })
                          : ''}
                      </Box>
                    )}

                    <Table
                      columns={tableHeaders}
                      data={tableItems}
                      onStyleRow={({ row, theme }) => {
                        if (getUserAgentDisabled(row.original.id)) {
                          return {
                            backgroundColor: theme.other.core.color.neutral['100'],
                          };
                        }
                      }}
                    />
                  </Box>
                ) : null}
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
              </Paper>
            </PageContainer>
          </Box>
        </Paper>
      </ContextContainer>
      <DisableUsersModal
        userAgents={store.checkeds}
        opened={store.actionModal === 'disable'}
        onClose={() => {
          store.actionModal = null;
          render();
        }}
        onConfirm={disableSelectedUsers}
      />
      <EnableUsersModal
        userAgents={store.checkeds}
        opened={store.actionModal === 'active'}
        onClose={() => {
          store.actionModal = null;
          render();
        }}
        onConfirm={enableSelectedUsers}
      />
      <UserDetailDrawer
        opened={store.openedUserDrawer}
        userId={store.openUser}
        centerId={store.center}
        profileId={store.profile}
        onChange={load}
        onClose={() => {
          store.openedUserDrawer = false;
          render();
        }}
      />
    </>
  );
}

export default ListUsers;
