import React from 'react';
import {
  Box,
  createStyles,
  ImageLoader,
  TabPanel,
  Tabs,
  Text,
  Title,
} from '@bubbles-ui/components';
import { isEmpty } from 'lodash';
import { Header } from './components/Header';
import ActivitiesTab from './components/ActivitiesTab';
import noFilters from './assets/noFilters.png';

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

  // const { data } = useSearchAssignableInstances({
  //   finished: true,
  //   finished_$gt: new Date('1-1-1970'),
  //   finished_$lt: new Date('27-june-2022'),
  // });
  if (isEmpty(filters)) {
    return (
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          width: '100%',
        }}
      >
        <Box
          sx={(theme) => ({
            position: 'absolute',
            width: '100%',
            bottom: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing[4],
          })}
        >
          <ImageLoader
            src={noFilters}
            imageStyles={{
              maxWidth: 573,
              width: '50%',
            }}
            height="100%"
          />
          <Box sx={{ maxWidth: '25%' }}>
            <Title>Copy scores</Title>
            <Text>
              Scores allow you to rating grading and non-grading task and attendance control. Select
              the program and class, then you can filter by time periods, you can save these periods
              so that teachers can use them as evaluation stages.
            </Text>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <Header isOpened={isOpened} onOpenChange={onOpenChange} filters={filters} />
      <Tabs className={classes.tabHeader}>
        <TabPanel label={labels.activitiesTab}>
          <ActivitiesTab filters={filters} />
        </TabPanel>
      </Tabs>
    </Box>
  );
}
