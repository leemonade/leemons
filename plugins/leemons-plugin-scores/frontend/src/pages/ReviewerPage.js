import React, { useRef } from 'react';
import Notebook from '@scores/components/__DEPRECATED__/FinalNotebook/Notebook';
import {
  Box,
  createStyles,
  TotalLayoutContainer,
  Stack,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import Header from '@scores/components/__DEPRECATED__/ScoresPage/Header';
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
  const scrollRef = useRef();

  return (
    <TotalLayoutContainer scrollRef={scrollRef} Header={<Header variant={'reviewPage'} />}>
      <Stack
        justifyContent="center"
        ref={scrollRef}
        style={{ overflow: 'auto', position: 'relative' }}
      >
        <TotalLayoutStepContainer>
          <Box className={classes.root}>
            <Box className={classes.headerContainer}>
              <Filters onChange={setFilters} />
            </Box>
            <Notebook filters={filters} />
          </Box>
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
}
