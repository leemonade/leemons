import React from 'react';

import { Text, Badge } from '@bubbles-ui/components';

import dayjs from 'dayjs';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import { unflatten } from '@common';
import { get } from 'lodash';
import UnreadMessages from '@comunica/UnreadMessages';
import { useClassesSubjects } from '@academic-portfolio/hooks';
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

function Progress({ assignation }) {
  const { instance } = assignation;
  const { classes } = instance;

  const labels = useProgressLocalizations();

  const classesSubjects = useClassesSubjects(classes);
  const subjectsCount = classesSubjects.length;

  const { requiresScoring, allowFeedback } = instance;

  const isEvaluable = requiresScoring || allowFeedback;
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
      return 'default';
    }

    const remainingDays = dayjs(instance.dates.deadline).diff(
      dayjs(instance.dates.start),
      'd',
      true
    );

    if (remainingDays >= 6) {
      return 'default';
    }

    if (remainingDays >= 5) {
      return 'warning';
    }

    return 'error';
  }, []);

  if (hasBeenEvaluated) {
    return (
      <Badge closable={false} color="stroke" severity="success">
        {labels?.evaluated}
      </Badge>
    );
  }

  if (activityHasBeenClosed && !studentHasFinished) {
    return (
      <Badge closable={false} color="stroke" severity="error">
        {labels?.notSubmitted}
      </Badge>
    );
  }

  if (!studentHasStarted) {
    return (
      <Badge closable={false} color="stroke" severity={severity}>
        {labels?.notStarted}
      </Badge>
    );
  }

  if (studentHasFinished) {
    if (isEvaluable) {
      return (
        <Badge closable={false} color="stroke" severity="success">
          {labels?.submitted}
        </Badge>
      );
    }

    return (
      <Badge closable={false} color="stroke" severity="success">
        {labels?.ended}
      </Badge>
    );
  }

  if (studentHasStarted) {
    return (
      <Badge closable={false} color="stroke" severity={severity}>
        {labels?.started}
      </Badge>
    );
  }
}

function getDashboardURL(assignation) {
  const { instance } = assignation;
  const {
    alwaysAvailable,
    dates: { start, deadline: _deadline, closed },
    assignable: { roleDetails },
  } = instance;

  const now = dayjs();
  const startDate = dayjs(start || null);
  const deadline = dayjs(_deadline || null);
  const closeDate = dayjs(closed || null);

  const isOpen =
    !closeDate.isValid() &&
    (alwaysAvailable || (!now.isBefore(startDate) && now.isBefore(deadline)));

  if (isOpen) {
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
  return {
    ...commonData,
    progress: <Progress assignation={assignation} />,
    messages: <UnreadMessages rooms={assignation.chatKeys} />,
    dashboardURL: () => getDashboardURL(assignation),
  };
}

export default parseAssignationForStudentView;
