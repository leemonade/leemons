import React from 'react';
import PropTypes from 'prop-types';
import { ActionButton, Box, Pager, Paper, Stack, Table } from '@bubbles-ui/components';
import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { listQuestionsBanksRequest } from '../../../../../request';

export default function ListByPublished({ t, published }) {
  const [loadingError, setLoadingError, LoadingErrorAlert] = useRequestErrorMessage();

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
      published,
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

  async function onPageChange(page) {
    store.page = page;
    await load();
  }

  async function onPageSizeChange(size) {
    store.size = size;
    await load();
  }

  React.useEffect(() => {
    load();
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
      {
        Header: t('actionsHeader'),
        accessor: 'actions',
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
  );
}

ListByPublished.propTypes = {
  published: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};
