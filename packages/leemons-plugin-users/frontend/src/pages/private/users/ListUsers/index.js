import React, { useEffect, useMemo } from 'react';
import _ from 'lodash';
import {
  ActionButton,
  Box,
  ContextContainer,
  PageContainer,
  Pager,
  Paper,
  SearchInput,
  Stack,
  Table,
} from '@bubbles-ui/components';

import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import prefixPN from '@users/helpers/prefixPN';
import { Link, useHistory } from 'react-router-dom';
import { useStore } from '@common';

import { listUsersRequest } from '../../../../request';
import { SelectCenter } from '../../../../components/SelectCenter';
import { SelectProfile } from '../../../../components/SelectProfile';

function ListUsers() {
  const [t] = useTranslateLoader(prefixPN('list_users'));
  const [store, render] = useStore({
    page: 0,
    size: 10,
  });
  const { t: tCommon } = useCommonTranslate('page_header');
  const [loadingError, setLoadingError, LoadingErrorAlert] = useRequestErrorMessage();

  const history = useHistory();

  const tableHeaders = useMemo(
    () => [
      {
        Header: t('nameHeader'),
        accessor: 'name',
        className: 'text-left',
      },
      {
        Header: t('surnameHeader'),
        accessor: 'surnames',
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
        Header: t('phoneHeader'),
        accessor: 'phone',
        className: 'text-left',
      },
      {
        Header: t('actionsHeader'),
        accessor: 'actions',
        className: 'text-right',
      },
    ],
    [t]
  );

  const tableItems = useMemo(
    () =>
      store.pagination
        ? _.map(store.pagination.items, (item) => ({
            ...item,
            actions: (
              <Box style={{ textAlign: 'right', width: '100%' }}>
                <ActionButton
                  as={Link}
                  to={`/private/users/detail/${item.id}`}
                  tooltip={t('view')}
                  icon={<ExpandDiagonalIcon />}
                />
              </Box>
            ),
          }))
        : [],
    [t, store.pagination]
  );

  async function listUsers() {
    const query = {};
    if (store.search) {
      query.$or = [
        { name_$contains: store.search.toLowerCase() },
        { surnames_$contains: store.search.toLowerCase() },
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
  }

  async function getPermissions() {
    const { permissions } = await getPermissionsWithActionsIfIHaveRequest(['plugins.users.users']);
    if (permissions[0]) {
      store.canAdd =
        permissions[0].actionNames.includes('create') ||
        permissions[0].actionNames.includes('admin');
      render();
    }
  }

  useEffect(() => {
    load();
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
    await load();
  }

  async function profileChange(profile) {
    store.profile = profile;
    await load();
  }

  async function searchChange(value) {
    store.search = value;
    await load();
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

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={headerValues}
        buttons={store.canAdd ? { new: tCommon('new') } : {}}
        onNew={() => goCreatePage()}
      />
      <Paper color="solid" shadow="none" padding="none">
        <Box>
          <PageContainer noFlex>
            <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
              <ContextContainer direction="row">
                <SelectCenter
                  clearable={t('clearFilter')}
                  label={t('centerLabel')}
                  value={store.center}
                  onChange={centerChange}
                />
                <SelectProfile
                  clearable={t('clearFilter')}
                  label={t('profileLabel')}
                  value={store.profile}
                  onChange={profileChange}
                />
                <SearchInput
                  label={t('searchLabel')}
                  value={store.search}
                  onChange={searchChange}
                />
              </ContextContainer>
            </Box>

            <Paper padding={2} mt={20} mb={20} fullWidth>
              <LoadingErrorAlert />
              {!store.loading && !loadingError ? (
                <Box>
                  <Table columns={tableHeaders} data={tableItems} />
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
  );
}

export default ListUsers;
