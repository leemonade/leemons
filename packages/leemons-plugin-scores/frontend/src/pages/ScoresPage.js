import React from 'react';
import Notebook from '@scores/components/Notebook';
import { Box, createStyles } from '@bubbles-ui/components';
import { Filters } from '../components/ScoresPage/Filters';
import { Header } from '../components/ScoresPage/Header';

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[5],
  },
}));

export default function ScoresPage() {
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
      <Box className={cx(classes.root)}>
        <Header />
        <Filters onChange={setFilters} />
      </Box>
      <Notebook filters={filters} />
    </Box>
  );
}
