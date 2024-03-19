import React from 'react';

import { Badge, Text } from '@bubbles-ui/components';

import dayjs from 'dayjs';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import { unflatten } from '@common';
import { get } from 'lodash';
import UnreadMessages from '@comunica/components/UnreadMessages';
import { useClassesSubjects } from '@academic-portfolio/hooks';
import { addInfoAlert } from '@layout/alert';
import { parseAssignationForCommonView } from './parseAssignationForCommon';

function getStatus(assignation) {
  const { instance } = assignation;

  const { alwaysAvailable: isAlwaysAvailable } = instance;

  const now = dayjs();
  const startDate = dayjs(instance.dates.start || null);
  const deadline = dayjs(instance.dates.deadline || null);
  const closeDate = dayjs(instance.dates.closed || null);

  const startTime = dayjs(assignation.timestamps.start || null);
  const endTime = dayjs(assignation.timestamps.end || null);

  const activityHasStarted = isAlwaysAvailable || (startDate.isValid() && !now.isBefore(startDate));
  const activityHasBeenClosed = isAlwaysAvailable
    ? closeDate.isValid() && !now.isBefore(closeDate)
    : deadline.isValid() && !now.isBefore(deadline);

  const studentHasStarted = startTime.isValid();
  const studentHasFinished = endTime.isValid();

  return {
    activityHasStarted,
    activityHasBeenClosed,
    studentHasStarted,
    studentHasFinished,
  };
}

function useProgressLocalizations() {
  const [, translations] = useTranslateLoader(prefixPN('activity_status'));

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return get(res, prefixPN('activity_status'));
    }

    return {};
  }, [translations]);
}

export function Progress({ assignation, isBlocked }) {
  const { instance } = assignation;
  const { classes } = instance;
  const isModule = instance.metadata?.module?.type === 'module';

  const labels = useProgressLocalizations();

  const classesSubjects = useClassesSubjects(classes);
  const subjectsCount = classesSubjects.length;

  const { requiresScoring, allowFeedback } = instance;

  const isEvaluable = !isModule && (requiresScoring || allowFeedback);
  // TODO: Add if has any feedback when only allowFeedback
  const hasAllGrades = React.useMemo(
    () =>
      assignation.grades.filter(({ type }) => type === 'main')?.length === subjectsCount &&
      subjectsCount > 0,
    [assignation.grades, subjectsCount]
  );

  const hasBeenEvaluated = isEvaluable && hasAllGrades;

  const { activityHasBeenClosed, studentHasFinished, studentHasStarted } = React.useMemo(
    () => getStatus(assignation),
    [assignation]
  );

  const severity = React.useMemo(() => {
    if (instance.alwaysAvailable || !instance.dates?.deadline || !instance.dates?.start) {
      return 'primary';
    }

    const remainingDays = dayjs(instance.dates.deadline).diff(
      dayjs(instance.dates.start),
      'd',
      true
    );

    if (remainingDays >= 6) {
      return 'primary';
    }

    if (remainingDays >= 5) {
      return 'warning';
    }

    return 'error';
  }, []);

  if (hasBeenEvaluated) {
    return <Text color="success">{labels?.evaluated}</Text>;
  }

  if (activityHasBeenClosed && !studentHasFinished) {
    return <Text color="error">{labels?.notSubmitted}</Text>;
  }

  if (studentHasFinished) {
    if (isEvaluable) {
      return <Text color="success">{labels?.submitted}</Text>;
    }

    return <Text color="success">{labels?.ended}</Text>;
  }

  if (isBlocked) {
    return <Text color={severity}>{labels?.blocked}</Text>;
  }

  if (!studentHasStarted) {
    return <Text color={severity}>{labels?.notStarted}</Text>;
  }

  if (studentHasStarted) {
    return <Text color={severity}>{labels?.started}</Text>;
  }
}

function isFinished(assignation) {
  const {
    instance,
    timestamps: { end },
  } = assignation;
  const {
    alwaysAvailable,
    dates: { deadline: _deadline, closed },
  } = instance;

  const now = dayjs();
  const deadline = dayjs(_deadline || null);
  const closeDate = dayjs(closed || null);
  const endTimestamp = dayjs(end || null);

  return (
    (alwaysAvailable && closeDate.isValid()) ||
    endTimestamp.isValid() ||
    (deadline.isValid() && !deadline.isAfter(now))
  );
}

function getDashboardURL(assignation) {
  const { instance } = assignation;
  const {
    assignable: { roleDetails },
  } = instance;

  const moduleId = instance?.metadata?.module?.id;

  const isEvaluable = instance.requiresScoring || instance.allowFeedback;
  const finished = isFinished(assignation);

  if (moduleId) {
    return `/private/learning-paths/modules/dashboard/${moduleId}`;
  }

  if (!finished || (!isEvaluable && !roleDetails.evaluationDetailUrl)) {
    return roleDetails.studentDetailUrl
      .replace(':id', instance.id)
      .replace(':user', assignation.user);
  }

  return roleDetails.evaluationDetailUrl
    .replace(':id', instance.id)
    .replace(':user', assignation.user);
}

export async function parseAssignationForStudentView(assignation, labels, options) {
  const { instance } = assignation;

  const commonData = await parseAssignationForCommonView(instance, labels, options);

  // const blockingActivitiesById = options.blockingActivities;
  // const blockingActivities = instance.relatedAssignableInstances?.blocking ?? [];

  const isBlocked = false; // blockingActivities.some((id) => !blockingActivitiesById?.[id]?.finished);

  return {
    ...commonData,
    isBlocked,
    progress: <Progress assignation={assignation} isBlocked={isBlocked} />,
    messages: !commonData?.parentModule && <UnreadMessages rooms={assignation.chatKeys} />,
    dashboardURL: () => getDashboardURL(assignation),
  };
}

export default parseAssignationForStudentView;
