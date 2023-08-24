import {
  ActionButton,
  Box,
  Pager,
  Paper,
  Stack,
  TabPanel,
  Table,
  Tabs,
} from '@bubbles-ui/components';
import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { listRolesRequest } from '@users/request';
import _ from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';

function ListRoles() {
  const [t] = useTranslateLoader(prefixPN('list_roles'));
  const { t: tCommon } = useCommonTranslate('page_header');
  const [loadingError, setLoadingError, LoadingErrorAlert] = useRequestErrorMessage();
  const [store, render] = useStore({
    page: 0,
    size: 10,
  });
  const history = useHistory();

  const tableHeaders = useMemo(
    () => [
      {
        Header: t('name'),
        accessor: 'name',
        className: 'text-left',
      },
      {
        Header: t('overview'),
        accessor: 'description',
        className: 'text-left',
      },
      {
        Header: t('actions'),
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
                  to={`/private/users/roles/detail/${item.uri}`}
                  tooltip={t('view')}
                  icon={<ExpandDiagonalIcon />}
                />
              </Box>
            ),
          }))
        : [],
    [t, store.pagination]
  );

  async function listRoles() {
    const { data } = await listRolesRequest({
      page: store.page,
      size: store.size,
    });

    return data;
  }

  async function load() {
    try {
      store.loading = true;
      render();
      store.pagination = await listRoles();
      store.loading = false;
      render();
    } catch (err) {
      setLoadingError(err);
    }
  }

  async function onPageChange(page) {
    store.page = page;
    await load();
  }

  async function onPageSizeChange(size) {
    store.size = Number(size);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  const headerValues = useMemo(
    () => ({
      title: t('page_title'),
      description: t('page_description'),
    }),
    [t]
  );

  return (
    <Stack direction="column" fullWidth fullHeight>
      <AdminPageHeader
        values={headerValues}
        buttons={{ new: tCommon('new') }}
        onNew={() => {
          history.push('/private/users/roles/detail');
        }}
      />

      <Box style={{ flex: 1 }}>
        <Tabs usePageLayout={true} panelColor="solid" fullHeight>
          <TabPanel label={t('page_title')}>
            {tableItems.length ? (
              <>
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
              </>
            ) : null}
          </TabPanel>
        </Tabs>
      </Box>
    </Stack>
  );
}

export default ListRoles;
