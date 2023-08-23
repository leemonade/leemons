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

const TaskOngoingList = ({ instance }) => {
  const instanceData = useTaskOngoingInstanceParser(instance);
  const [containerRef, containerRect] = useResizeObserver();
  const [childRef, childRect] = useResizeObserver();
  const { mutateAsync } = useMutateAssignableInstance();
  const { openConfirmationModal } = useLayout();
  const [archived, setArchived] = React.useState(!!instance?.dates?.archived);

  React.useEffect(() => {
    const arch = !!instance?.dates?.archived;

    if (arch !== archived) {
      setArchived(arch);
    }
  }, [instance]);

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

  const subjects = useClassesSubjects(instance.classes);

  const { classes } = TaskOngoingListStyles({}, { name: 'TaskOngoingList' });

  const onCloseTask = async (closed) => {
    const newDates = {
      closed: closed ? new Date() : null,
    };

    if (dayjs(instance.dates.close).isBefore(dayjs())) {
      newDates.close = null;
    }

    try {
      await mutateAsync({ id: instance.id, dates: newDates });

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

  const archiveTask = async (archivedValue) => {
    const newDates = {
      archived: archivedValue ? new Date() : null,
      // TODO: Do not close if not closable
      closed: archivedValue && !instance.dates.deadline ? new Date() : undefined,
    };

    try {
      await mutateAsync({ id: instance.id, dates: newDates });

      let verb = dashboardLocalizations.archiveAction.verbs.archived;
      if (!archivedValue) {
        verb = dashboardLocalizations.archiveAction.verbs.unarchived;
      }
      addSuccessAlert(
        dashboardLocalizations.archiveAction.messages.success.replace('{{verb}}', verb)
      );
    } catch (e) {
      let verb = dashboardLocalizations.archiveAction.verbs.archiving;
      if (!archivedValue) {
        verb = dashboardLocalizations.archiveAction.verbs.unarchiving;
      }
      addErrorAlert(
        dashboardLocalizations.archiveAction.messages.error
          .replace('{{verb}}', verb)
          .replace('{{error}}', e.message)
      );
    }
  };

  const onArchiveTask = async (archivedValue) => {
    if (!archivedValue) {
      return archiveTask(archivedValue);
    }

    if (instance.requiresScoring || instance.allowFeedback) {
      if (
        instance.students.some(
          (student) =>
            student.grades.filter((grade) => grade.type === 'main').length < subjects?.length
        )
      ) {
        setArchived(true);
        return openConfirmationModal({
          title: dashboardLocalizations?.archiveModal?.title,
          description: (
            <Box
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing[2],
              })}
            >
              <Text>{dashboardLocalizations?.archiveModal?.message1}</Text>
              <Text>{dashboardLocalizations?.archiveModal?.message2}</Text>
            </Box>
          ),
          labels: {
            confirm: dashboardLocalizations?.archiveModal?.confirm,
            cancel: dashboardLocalizations?.archiveModal?.cancel,
          },
          onConfirm: () => {
            archiveTask(archivedValue);
          },
          onCancel: () => {
            setArchived(false);
          },
        })();
      }
    }
    return archiveTask(archivedValue);
  };

  const onDateChange = async (type, date) => {
    const newDates = {
      [type]: date,
    };

    try {
      await mutateAsync({ id: instance.id, dates: newDates });
      addSuccessAlert(dashboardLocalizations[type].messages.success);
    } catch (e) {
      addErrorAlert(dashboardLocalizations[type].messages.error.replace('{{error}}', e.message));
    }
  };

  const isStarted = new Date(instance?.dates?.start) < new Date();

  return (
    <Box ref={containerRef} className={classes.root}>
      <Box
        ref={childRef}
        style={{ width: containerRect.width, top: containerRect.top }}
        className={classes.header}
      >
        <HeaderBackground
          {...instanceData.headerBackground}
          styles={{ position: 'absolute', zIndex: 1 }}
          backgroundPosition="center"
          withGradient
        />
        <Box className={classes.taskHeaderContainer}>
          <TaskDeadlineHeader
            {...instanceData.taskDeadlineHeader}
            onStartDateChange={(value) => onDateChange('start', value)}
            onDeadlineChange={(value) => onDateChange('deadline', value)}
            onCloseTask={onCloseTask}
            onArchiveTask={onArchiveTask}
            closed={Boolean(instance.dates.closed || dayjs(instance.dates.close).isBefore(dayjs()))}
            // TODO: Show close date if a deadline exists but is allowed to be submitted later.
            disableClose={Boolean(instance.dates.archived)}
            hideClose={Boolean(instance.dates.deadline)}
            hideArchive={Boolean(dayjs(instance.dates.deadline).isAfter(dayjs()))}
            archived={archived}
            isStarted={isStarted}
          />
        </Box>
        {instanceData.horizontalTimeline && (
          <HorizontalTimeline
            {...instanceData.horizontalTimeline}
            rootStyles={{
              position: 'absolute',
              right: 0,
              bottom: '50%',
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
    </Box>
  );
};

TaskOngoingList.defaultProps = TASK_ONGOING_LIST_DEFAULT_PROPS;
TaskOngoingList.propTypes = TASK_ONGOING_LIST_PROP_TYPES;

export { TaskOngoingList };
