import Assistances from '@attendance-control/components/AssistancePage/Assistances';
import { prefixPN } from '@attendance-control/helpers';
import { Box, createStyles } from '@bubbles-ui/components';
import Filters from '@scores/components/ScoresPage/Filters';
import Header from '@scores/components/ScoresPage/Header';
import React from 'react';

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[5],
    height: '100%',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[5],
  },
}));

export default function AssistancePage() {
  /*
    --- Style ---
  */
  const { classes } = useStyles();

  /*
    --- State ---
  */
  const [filters, setFilters] = React.useState({});

  return (
    <Box className={classes.root}>
      <Box className={classes.headerContainer}>
        <Header prefixPN={prefixPN} variant={'assistancePage'} />
        <Filters onChange={setFilters} />
      </Box>
      <Assistances filters={filters} />
    </Box>
  );
}
