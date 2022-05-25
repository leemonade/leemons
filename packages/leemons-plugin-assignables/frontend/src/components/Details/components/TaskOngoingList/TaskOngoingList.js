import React, { useMemo } from 'react';
import {
  Box,
  HorizontalTimeline,
  Text,
  ScoresBar,
  useResizeObserver,
} from '@bubbles-ui/components';
import { HeaderBackground, TaskDeadlineHeader } from '@bubbles-ui/leemons';
import { OpenIcon, TimeClockCircleIcon, CheckCircleIcon } from '@bubbles-ui/icons/outline';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import dayjs from 'dayjs';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import updateAssignableInstance from '../../../../requests/assignableInstances/updateAssignableInstance';
import { TaskOngoingListStyles } from './TaskOngoingList.styles';
import {
  TASK_ONGOING_LIST_DEFAULT_PROPS,
  TASK_ONGOING_LIST_PROP_TYPES,
} from './TaskOngoingList.constants';
import useTaskOngoingInstanceParser from './hooks/useTaskOngoingInstanceParser';
import prefixPN from '../../../../helpers/prefixPN';

const TaskOngoingList = ({ instance }) => {
  const instanceData = useTaskOngoingInstanceParser(instance);
  const [containerRef, containerRect] = useResizeObserver();
  const [childRef, childRect] = useResizeObserver();

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

  const { classes } = TaskOngoingListStyles({}, { name: 'TaskOngoingList' });

  const onCloseTask = async (closed) => {
    const newDates = {
      closed: closed ? new Date() : null,
    };

    if (dayjs(instance.dates.close).isBefore(dayjs())) {
      newDates.close = null;
    }

    try {
      await updateAssignableInstance({ id: instance.id, dates: newDates });

      let verb = dashboardLocalizations.closeAction.verbs.closed;
      if (!closed) {
        verb = dashboardLocalizations.closeAction.verbs.opened;
      }
      addSuccessAlert(
        dashboardLocalizations.closeAction.messages.success.replace('{{verb}}', verb)
      );
    } catch (e) {
      let verb = dashboardLocalizations.closeAction.verbs.closing;
      if (!closed) {
        verb = dashboardLocalizations.closeAction.verbs.opening;
      }
      addErrorAlert(
        dashboardLocalizations.closeAction.messages.error
          .replace('{{verb}}', verb)
          .replace('{{error}}', e.message)
      );
    }
  };

  const onDeadlineChange = async (deadline) => {
    const newDates = {
      deadline,
    };

    try {
      await updateAssignableInstance({ id: instance.id, dates: newDates });

      addSuccessAlert(dashboardLocalizations.deadline.messages.success);
    } catch (e) {
      addErrorAlert(dashboardLocalizations.deadline.messages.error.replace('{{error}}', e.message));
    }
  };

  return (
    <Box ref={containerRef} className={classes.root}>
      <Box
        ref={childRef}
        style={{ width: containerRect.width, top: containerRect.top }}
        className={classes.header}
      >
        <HeaderBackground
          {...instanceData.headerBackground}
          styles={{ position: 'absolute' }}
          backgroundPosition="center"
          withOverlay
          blur={10}
        />

        <TaskDeadlineHeader
          {...instanceData.taskDeadlineHeader}
          onDeadlineChange={onDeadlineChange}
          onCloseTask={onCloseTask}
          styles={{ position: 'absolute', bottom: 0, left: 0, right: '50%', zIndex: 5 }}
        />
        {instanceData.horizontalTimeline && (
          <HorizontalTimeline
            {...instanceData.horizontalTimeline}
            rootStyles={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: '50%',
              paddingInline: 48,
              paddingBottom: 10,
              zIndex: 5,
            }}
          />
        )}
      </Box>
      <Box style={{ marginTop: childRect.height }} className={classes.mainContent}>
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
                <Text role="productive">{statusLocalizations?.ongoing}</Text>
              </Box>
              <Box className={classes.legend}>
                <CheckCircleIcon width={12} height={12} />
                <Text role="productive">{statusLocalizations?.completed}</Text>
              </Box>
            </Box>
            <ScoresBar {...instanceData.leftScoresBar} />
          </Box>
        </Box>
        <Box className={classes.rightSide}>
          <Text transform="uppercase">{dashboardLocalizations?.labels?.graphs?.grades}</Text>
          <Box className={classes.rightScoreBarWrapper}>
            {instanceData.rightScoresBar && <ScoresBar {...instanceData.rightScoresBar} />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

TaskOngoingList.defaultProps = TASK_ONGOING_LIST_DEFAULT_PROPS;
TaskOngoingList.propTypes = TASK_ONGOING_LIST_PROP_TYPES;

export { TaskOngoingList };
