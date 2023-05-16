import React from 'react';
import Notebook from '@scores/components/FinalNotebook/Notebook';
import { Box, createStyles } from '@bubbles-ui/components';
import Header from '@scores/components/ScoresPage/Header';
import Filters from '@scores/components/ReviewerPage/Filters';

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

export default function ReviewerPage() {
  /*
    --- Style ---
  */
  const { classes, cx } = useStyles();

  /*
    --- State ---
  */
  const [filters, setFilters] = React.useState({});

  return (
    <Box className={classes.root}>
      <Box className={classes.headerContainer}>
        <Header variant={'reviewPage'} />
        <Filters onChange={setFilters} />
      </Box>
      <Notebook filters={filters} />
    </Box>
  );
}
