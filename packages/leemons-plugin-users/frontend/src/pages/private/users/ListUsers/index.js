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
import _ from 'lodash';
import React, { useEffect, useMemo } from 'react';

import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import { Link, useHistory } from 'react-router-dom';

import { SelectCenter } from '../../../../components/SelectCenter';
import { SelectProfile } from '../../../../components/SelectProfile';
import { listUsersRequest } from '../../../../request';

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
    const [{ permissions: addPermission }, { permissions: importPermission }] = await Promise.all([
      getPermissionsWithActionsIfIHaveRequest('plugins.users.users'),
      getPermissionsWithActionsIfIHaveRequest('plugins.users.import'),
    ]);
    console.log(importPermission);
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

  function goImportPage() {
    history.push('/private/users/import');
  }

  const headerButtons = React.useMemo(() => {
    const result = {};
    if (store.canAdd) result.new = tCommon('new');
    if (store.canImport) result.import = t('import');
    return result;
  }, [store.canImport, store.canAdd]);

  return (
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
