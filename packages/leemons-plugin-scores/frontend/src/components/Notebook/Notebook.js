import React from 'react';
import { Box, createStyles, TabPanel, Tabs } from '@bubbles-ui/components';
import { Header } from './components/Header';
import ActivitiesTab from './components/ActivitiesTab';

const useStyles = createStyles((theme, { isOpened } = {}) => ({
  root: {
    width: isOpened ? 'calc(100% - 370px)' : '100%',
    boxSizing: 'border-box',
    transition: 'width 0.3s ease-in-out',
  },
  tabHeader: {
    backgroundColor: theme.colors.interactive03h,
  },
}));

export default function Notebook({ isOpened, onOpenChange, filters }) {
  const { classes } = useStyles({ isOpened });

  const labels = {
    activitiesTab: 'Actividades evaluadas',
  };

  return (
    <Box className={classes.root}>
      <Header isOpened={isOpened} onOpenChange={onOpenChange} filters={filters} />
      <Tabs className={classes.tabHeader}>
        <TabPanel label={labels.activitiesTab}>
          <ActivitiesTab />
        </TabPanel>
      </Tabs>
    </Box>
  );
}
