import { getClassSessionsRequest } from '@attendance-control/request';
import { Box, createStyles, Loader } from '@bubbles-ui/components';
import { useRequestErrorMessage, useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import { EmptyState } from '@scores/components/Notebook/components/ActivitiesTab/EmptyState';
import React from 'react';
import Table from './Table';

const useTableStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    boxSizing: 'border-box',
    transition: 'width 0.3s ease-in-out',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  tabHeader: {
    flex: 1,
  },
}));

function LoadingState() {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        backgroundColor: theme.white,
      })}
    >
      <Loader />
    </Box>
  );
}

export default function AssistancesInfo({ filters }) {
  const { classes } = useTableStyles();
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [store, render] = useStore({
    loading: true,
  });

  async function load(silent = false) {
    try {
      if (!silent) {
        store.sessions = [];
        store.loading = true;
        render();
      }
      const { sessions } = await getClassSessionsRequest({
        class: filters.class.id,
        start: filters.startDate,
        end: filters.endDate,
      });
      store.sessions = sessions;
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
    store.loading = false;
    render();
  }

  React.useEffect(() => {
    if (filters) load();
  }, [filters]);

  if (store.loading) {
    return <LoadingState />;
  }

  if (store.sessions?.length) {
    return <Table sessions={store.sessions} classe={filters.class} onSave={() => load(true)} />;
  }

  return <EmptyState />;
}
