import React, { useState } from 'react';
import {
  Box,
  DrawerPush,
  Text,
  IconButton,
  Button,
  Tabs,
  TabPanel,
  SearchInput,
  Select,
  Switch,
} from '@bubbles-ui/components';
import { ScoresBasicTable, ScoresPeriodForm } from '@bubbles-ui/leemons';
import {
  MoveLeftIcon,
  MoveRightIcon,
  PluginScoresBasicIcon,
  DownloadIcon,
} from '@bubbles-ui/icons/outline';
import { ScoresStyles } from './Scores.styles';
import { SCORES_DEFAULT_PROPS, SCORES_PROP_TYPES } from './Scores.constants';
import { mock } from './mock/data';

export default function Scores() {
  const [isOpened, setIsOpened] = useState(false);

  const { classes, cx } = ScoresStyles({ isOpened }, { name: 'Scores' });
  return (
    <Box className={classes.root}>
      <DrawerPush opened={isOpened} size={370} fixed>
        <Box className={classes.drawer}>
          <Box className={classes.drawerTitle}>
            <Box className={classes.titleTop}>
              <PluginScoresBasicIcon width={16} height={16} />
              <Text size="md">Scores</Text>
            </Box>
            <Text size="md" style={{ marginLeft: 24 }} strong>
              Scores Basic (admin)
            </Text>
          </Box>
          <Text className={classes.drawerText} role="productive">
            Scores allow you to rating grading and non-grading task and attendance control. Select
            the program and class, then you can filter by time periods, you can save these periods
            so that teachers can use them as evaluation stages.
          </Text>
          <Text
            className={classes.formTitle}
            role="productive"
            strong
            color="soft"
            size="xs"
            transform="uppercase"
          >
            Search period
          </Text>
          <ScoresPeriodForm {...mock.formData} />
        </Box>
      </DrawerPush>
      <Box className={classes.mainContent}>
        <Box className={classes.mainContentTitle}>
          {isOpened && (
            <IconButton
              variant="transparent"
              size="lg"
              icon={<MoveLeftIcon />}
              onClick={() => setIsOpened(false)}
            />
          )}
          {!isOpened && (
            <IconButton
              variant="transparent"
              size="lg"
              icon={<MoveRightIcon />}
              onClick={() => setIsOpened(true)}
            />
          )}
          <Text style={{ flex: 1 }} size="lg" color="primary" strong>
            Biología 1009 - 1ºB (01/01/2020 - 03/01/2020)
          </Text>
          <Button variant="outline" size="xs" position="center" leftIcon={<DownloadIcon />}>
            Export scores to CSV
          </Button>
        </Box>
        <Tabs className={classes.tabHeader}>
          <TabPanel label="Tasks control">
            <Box className={classes.tableFilters}>
              <Box className={classes.filters}>
                <Select
                  variant="unstyled"
                  placeholder="Filter by"
                  data={['Filter 1', 'Filter 2', 'Filter 3']}
                />
                <SearchInput placeholder="Search" />
                <Switch size="md" label="Non-grading tasks" />
                <Switch size="md" label="Asessment criteria" />
              </Box>
              <Button>Save scores</Button>
            </Box>
            <Box style={{ display: 'flex' }}>
              <ScoresBasicTable {...mock.tableData} />
            </Box>
          </TabPanel>
          <TabPanel label="Attendance control" disabled></TabPanel>
        </Tabs>
      </Box>
    </Box>
  );
}

Scores.propTypes = SCORES_PROP_TYPES;
