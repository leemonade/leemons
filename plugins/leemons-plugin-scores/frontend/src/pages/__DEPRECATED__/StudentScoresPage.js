import React, { useRef } from 'react';
import Notebook from '@scores/components/__DEPRECATED__/Notebook';
import {
  Box,
  createStyles,
  TotalLayoutContainer,
  Stack,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import { Filters } from '../../components/__DEPRECATED__/StudentScoresPage/Filters';
import { Header } from '../../components/__DEPRECATED__/StudentScoresPage/Header';

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
  const [filters, setFilters] = React.useState({});
  const [klasses, setKlasses] = React.useState();

  const scrollRef = useRef();

  return (
    <TotalLayoutContainer scrollRef={scrollRef} Header={<Header />}>
      <Stack
        justifyContent="center"
        ref={scrollRef}
        style={{ overflow: 'auto', position: 'relative' }}
      >
        <TotalLayoutStepContainer fullWidth>
          <Box className={classes.root}>
            <Box className={classes.headerContainer}>
              <Filters onChange={setFilters} setKlasses={setKlasses} />
            </Box>
            <Notebook filters={filters} klasses={klasses} isStudent />
          </Box>
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
}
