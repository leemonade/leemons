import React, { useRef } from 'react';
import Notebook from '@scores/components/Notebook';
import {
  Box,
  ContextContainer,
  Stack,
  TabPanel,
  Tabs,
  TotalLayoutContainer,
  TotalLayoutFooterContainer,
  Button,
  TotalLayoutStepContainer,
  createStyles,
} from '@bubbles-ui/components';
import { CloudUploadIcon } from '@bubbles-ui/icons/outline';
import Footer from '@scores/components/ScoresPage/Footer';
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
  const [filters, setFilters] = React.useState({});
  const scrollRef = useRef();

  return (
    <TotalLayoutContainer Header={<Header variant={'scoresPage'} />} scrollRef={scrollRef}>
      <Stack justifyContent="center" fullWidth fullHeight>
        <TotalLayoutStepContainer clean Footer={<Footer scrollRef={scrollRef} />}>
          <Tabs tabPanelListStyle={{ backgroundColor: 'white' }} fullHeight ref={scrollRef}>
            <TabPanel key="subject" label="By subject">
              <ContextContainer padded>
                <Box className={classes.root}>
                  <Box className={classes.headerContainer}>
                    <Filters onChange={setFilters} />
                  </Box>
                  <Notebook filters={filters} />
                </Box>
              </ContextContainer>
            </TabPanel>
            <TabPanel key="criteria" label="By criteria"></TabPanel>
          </Tabs>
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
}
