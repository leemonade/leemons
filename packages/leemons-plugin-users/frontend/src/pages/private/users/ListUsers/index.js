import React, { useEffect, useMemo } from 'react';
import _ from 'lodash';
import {
  ActionButton,
  Box,
  PageContainer,
  Paper,
  Stack,
  Table,
  TabPanel,
  Tabs,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { goDetailProfilePage } from '@users/navigate';
import prefixPN from '@users/helpers/prefixPN';
import { Link, useHistory } from 'react-router-dom';
import { useStore } from '@common';
import { listUsersRequest } from '../../../../request';
import { SelectCenter } from '../../../../components/SelectCenter';

function ListUsers() {
  const [t] = useTranslateLoader(prefixPN('list_users'));
  const [store, render] = useStore();
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
    const { data } = await listUsersRequest({
      page: 0,
      size: 99999999,
    });

    return data;
  }

  const load = async () => {
    try {
      store.pagination = await listUsers();
      store.loading = false;
      render();
    } catch (err) {
      setLoadingError(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const headerValues = useMemo(
    () => ({
      title: t('pageTitle'),
    }),
    [t]
  );

  return (
    <Stack direction="column" fullWidth fullHeight>
      <AdminPageHeader
        values={headerValues}
        buttons={{ new: tCommon('new') }}
        onNew={() => goDetailProfilePage(history)}
      />

      <PageContainer noFlex>
        <SelectCenter />
      </PageContainer>

      <Box style={{ flex: 1 }}>
        <Tabs usePageLayout={true} panelColor="solid" fullHeight>
          <TabPanel label={t('usersTab')}>
            <Paper padding={2} mt={20} mb={20} fullWidth>
              <LoadingErrorAlert />
              {!store.loading && !loadingError ? (
                <Box>
                  <Table columns={tableHeaders} data={tableItems} />
                </Box>
              ) : null}
            </Paper>
          </TabPanel>
        </Tabs>
      </Box>
    </Stack>
  );
}

export default ListUsers;
