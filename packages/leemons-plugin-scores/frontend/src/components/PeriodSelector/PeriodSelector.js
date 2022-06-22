import React from 'react';
import { Box, createStyles, DrawerPush, Text } from '@bubbles-ui/components';

import {
  MoveLeftIcon,
  MoveRightIcon,
  PluginScoresBasicIcon,
  DownloadIcon,
} from '@bubbles-ui/icons/outline';
import { ScoresPeriodForm } from '@bubbles-ui/leemons';

const useStyle = createStyles((theme, { isOpened }) => ({
  drawer: {
    height: '100vh',
    padding: isOpened && 32,
    paddingLeft: isOpened && 48,
    borderRight: isOpened && `1px solid ${theme.colors.ui01}`,
  },
  drawerTitle: {
    marginBottom: 34,
    '*': {
      color: theme.colors.text04,
    },
  },
  titleTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  drawerText: {
    display: 'block',
    marginBottom: 48,
    lineHeight: '22.4px',
  },

  formTitle: {
    display: 'block',
    marginBottom: 24,
  },
}));

export default function PeriodSelector({
  opened,
  size = 370,
  fixed = true,
  allowCreate,
  periods,
  onPeriodSave,
  locale,
}) {
  const { classes } = useStyle({ isOpened: opened });

  const labels = {
    startDate: 'Start date',
    endDate: 'End date',
    submit: 'Search',
    newPeriod: 'New period',
    addPeriod: 'Add new period',
    shareWithTeachers: 'Share with teachers',
    saveButton: 'Save time period',
  };

  const errorMessages = {
    startDate: 'Required start date',
    endDate: 'Required end date',
    validateStartDate: 'Start date is greater than end date',
    validateEndDate: 'End date is smaller than start date',
  };

  const fields = [
    {
      name: 'program',
      placeholder: 'Select program',
      data: ['Program 1', 'Program 2', 'Program 3'],
      required: 'Required field',
    },
    {
      name: 'course',
      placeholder: 'Select course',
      data: ['Course 1', 'Course 2', 'Course 3'],
      required: 'Required field',
    },
    {
      name: 'subject',
      placeholder: 'Select subject',
      data: ['Subject 1', 'Subject 2', 'Subject 3'],
    },
  ];

  return (
    <DrawerPush opened={opened} size={370} fixed>
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
          Scores allow you to rating grading and non-grading task and attendance control. Select the
          program and class, then you can filter by time periods, you can save these periods so that
          teachers can use them as evaluation stages.
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
        <ScoresPeriodForm
          labels={labels}
          errorMessages={errorMessages}
          fields={fields}
          allowCreate={allowCreate}
          periods={periods}
          onSave={onPeriodSave}
          locale={locale}
        />
      </Box>
    </DrawerPush>
  );
}
