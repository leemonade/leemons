import { Box, createStyles } from '@bubbles-ui/components';
import { Header } from '@scores/components/__DEPRECATED__/Notebook/components/Header';
import { EmptyState } from '@scores/components/__DEPRECATED__/Notebook/EmptyState';
import { isEmpty } from 'lodash';
import React from 'react';
import AssistancesInfo from './components/AssistancesInfo';

const useAssistancesStyles = createStyles((theme) => ({
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

export default function Assistances({ filters, hideHeader }) {
  const { classes } = useAssistancesStyles();

  if (isEmpty(filters)) {
    return <EmptyState isStudent={false} />;
  }

  return (
    <Box className={classes.root}>
      {!hideHeader ? (
        <Header filters={filters} variant="notebook" allowDownload isStudent={false} />
      ) : null}
      <AssistancesInfo filters={filters} />
    </Box>
  );
}
