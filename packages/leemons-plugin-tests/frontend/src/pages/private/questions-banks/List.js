import React from 'react';
import {
  ActionButton,
  Box,
  ContextContainer,
  PageContainer,
  Pager,
  Paper,
  Stack,
  Table,
} from '@bubbles-ui/components';
import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { Link, useHistory } from 'react-router-dom';
import _ from 'lodash';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import { listQuestionsBanksRequest } from '../../../request';

export default function List() {
  const [t] = useTranslateLoader(prefixPN('questionsBanksList'));
  const { t: tCommon } = useCommonTranslate('page_header');
  const [loadingError, setLoadingError, LoadingErrorAlert] = useRequestErrorMessage();

  const history = useHistory();

  // ----------------------------------------------------------------------
  // SETTINGS
  const [store, render] = useStore({
    loading: true,
    page: 0,
    size: 10,
  });

  async function listQuestionsBanks() {
    const { data } = await listQuestionsBanksRequest({
      page: store.page,
      size: store.size,
    });
    return data;
  }

  async function load() {
    try {
      store.loading = true;
      render();
      store.pagination = await listQuestionsBanks();
      store.loading = false;
      render();
    } catch (err) {
      setLoadingError(err);
    }
  }

  async function getPermissions() {
    const { permissions } = await getPermissionsWithActionsIfIHaveRequest([
      'plugins.tests.questionsBanks',
    ]);
    if (permissions[0]) {
      store.canAdd =
        permissions[0].actionNames.includes('create') ||
        permissions[0].actionNames.includes('admin');
      render();
    }
  }

  async function onPageChange(page) {
    store.page = page;
    await load();
  }

  async function onPageSizeChange(size) {
    store.size = size;
    await load();
  }

  function goCreatePage() {
    history.push('/private/tests/questions-banks/new');
  }

  React.useEffect(() => {
    load();
    getPermissions();
  }, []);

  const tableHeaders = React.useMemo(
    () => [
      {
        Header: t('nameHeader'),
        accessor: 'name',
        className: 'text-left',
      },
      {
        Header: t('nQuestionsHeader'),
        accessor: 'nQuestions',
        className: 'text-right',
      },
      {
        Header: t('levelHeader'),
        accessor: 'level',
        className: 'text-right',
      },
    ],
    [t]
  );

  const tableItems = React.useMemo(
    () =>
      store.pagination
        ? _.map(store.pagination.items, (item) => ({
            ...item,
            actions: (
              <Box style={{ textAlign: 'right', width: '100%' }}>
                <ActionButton
                  as={Link}
                  to={`/private/tests/questions-banks/${item.id}`}
                  tooltip={t('view')}
                  icon={<ExpandDiagonalIcon />}
                />
              </Box>
            ),
          }))
        : [],
    [t, store.pagination]
  );

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{
          title: t('pageTitle'),
        }}
        buttons={store.canAdd ? { new: tCommon('new') } : {}}
        onNew={() => goCreatePage()}
      />
      <Paper color="solid" shadow="none" padding="none">
        <Box>
          <PageContainer noFlex>
            <Paper padding={2} mt={20} mb={20} fullWidth>
              <LoadingErrorAlert />
              {!store.loading && !loadingError ? (
                <>
                  <Box>
                    <Table columns={tableHeaders} data={tableItems} />
                  </Box>
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
                </>
              ) : null}
            </Paper>
          </PageContainer>
        </Box>
      </Paper>
    </ContextContainer>
  );
}
