import React, { useState, useRef } from 'react';
import Notebook from '@scores/components/Notebook';
import {
  TotalLayoutContainer,
  Stack,
  TotalLayoutStepContainer,
  Box,
  createStyles,
} from '@bubbles-ui/components';
import { Filters } from '../components/ScoresPage/Filters';
import { Header } from '../components/ScoresPage/Header';

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

export default function ScoresPage() {
  /*
    --- Style ---
  */
  const { classes } = useStyles();

  /*
    --- State ---
  */
  const [filters, setFilters] = useState({});
  const [localFilters, setLocalFilters] = React.useState({});

  const scrollRef = useRef();

  return (
    <TotalLayoutContainer scrollRef={scrollRef} Header={<Header variant={'scoresPage'} />}>
      <Stack
        justifyContent="center"
        ref={scrollRef}
        style={{ overflow: 'auto', position: 'relative' }}
      >
        <TotalLayoutStepContainer>
          <Box className={classes.headerContainer}>
            <Filters onChange={setFilters} />
            <Notebook
              filters={filters}
              localFilters={localFilters}
              setLocalFilters={setLocalFilters}
              scrollRef={scrollRef}
            />
          </Box>
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
}
