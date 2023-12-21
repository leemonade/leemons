import React, { useMemo } from 'react';
import {
  Box,
  HorizontalTimeline,
  Text,
  ScoresBar,
  useResizeObserver,
  Stack,
} from '@bubbles-ui/components';
import { HeaderBackground, TaskDeadlineHeader } from '@bubbles-ui/leemons';
import { OpenIcon, TimeClockCircleIcon, CheckCircleIcon } from '@bubbles-ui/icons/outline';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import dayjs from 'dayjs';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useClassesSubjects } from '@academic-portfolio/hooks';
import { useLayout } from '@layout/context';
import { TaskOngoingListStyles } from './TaskOngoingList.styles';
import {
  TASK_ONGOING_LIST_DEFAULT_PROPS,
  TASK_ONGOING_LIST_PROP_TYPES,
} from './TaskOngoingList.constants';
import useTaskOngoingInstanceParser from './hooks/useTaskOngoingInstanceParser';
import prefixPN from '../../../../helpers/prefixPN';
import useMutateAssignableInstance from '../../../../hooks/assignableInstance/useMutateAssignableInstance';

export function useTaskOngoingListLocalizations() {
  const [, translations] = useTranslateLoader([
    prefixPN('activity_dashboard'),
    prefixPN('activity_status'),
  ]);

  const { dashboardLocalizations, statusLocalizations } = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return {
        dashboardLocalizations: _.get(res, prefixPN('activity_dashboard')),
        statusLocalizations: _.get(res, prefixPN('activity_status')),
      };
    }

    return {};
  }, [translations]);

  return {
    dashboardLocalizations,
    statusLocalizations,
  };
}

const TaskOngoingList = ({ instance }) => {
  const instanceData = useTaskOngoingInstanceParser(instance);
  const { dashboardLocalizations, statusLocalizations } = useTaskOngoingListLocalizations();

  const { classes } = TaskOngoingListStyles({}, { name: 'TaskOngoingList' });

  return (
    <Box style={{ marginTop: 0 }} className={classes.mainContent}>
      <Box className={classes.leftSide}>
        <Text transform="uppercase">{dashboardLocalizations?.labels?.graphs?.status}</Text>
        <Box className={classes.leftScoreBarWrapper}>
          <Box className={classes.scoreBarLeftLegend}>
            <Box className={classes.legend}>
              <OpenIcon width={12} height={12} />
              <Text role="productive">{statusLocalizations?.opened}</Text>
            </Box>
            <Box className={classes.legend}>
              <TimeClockCircleIcon width={12} height={12} />
              <Text role="productive">{statusLocalizations?.started}</Text>
            </Box>
            <Box className={classes.legend}>
              <CheckCircleIcon width={12} height={12} />
              <Text role="productive">{statusLocalizations?.submitted}</Text>
            </Box>
          </Box>
          <ScoresBar {...instanceData.leftScoresBar} />
        </Box>
      </Box>
      {!!instance?.requiresScoring && (
        <Box className={classes.rightSide}>
          <Text transform="uppercase">{dashboardLocalizations?.labels?.graphs?.grades}</Text>
          <Box className={classes.rightScoreBarWrapper}>
            {instanceData.rightScoresBar && <ScoresBar {...instanceData.rightScoresBar} />}
          </Box>
        </Box>
      )}
    </Box>
  );
};

TaskOngoingList.defaultProps = TASK_ONGOING_LIST_DEFAULT_PROPS;
TaskOngoingList.propTypes = TASK_ONGOING_LIST_PROP_TYPES;

export { TaskOngoingList };
