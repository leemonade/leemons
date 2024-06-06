import React, { useState, useRef } from 'react';
import Notebook from '@scores/components/__DEPRECATED__/Notebook';
import {
  TotalLayoutContainer,
  Stack,
  TotalLayoutStepContainer,
  Box,
  createStyles,
} from '@bubbles-ui/components';
import Filters from '@scores/components/__DEPRECATED__/ScoresPage/Filters/Filters';
import { Header } from '../../components/__DEPRECATED__/ScoresPage/Header';

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
        <TotalLayoutStepContainer fullWidth>
          <Box className={classes.headerContainer}>
            <Filters showProgramSelect onChange={setFilters} />
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
