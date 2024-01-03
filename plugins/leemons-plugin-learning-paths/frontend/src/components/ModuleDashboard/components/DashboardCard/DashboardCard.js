/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, ImageLoader, Text, TextClamp } from '@bubbles-ui/components';
import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { capitalize, get } from 'lodash';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { LocaleDate, LocaleDuration } from '@common';
import {
  useEvaluationType,
  useEvaluationTypeLocalizations,
} from '@assignables/hooks/useEvaluationType';
import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import { Link } from 'react-router-dom';
import { useDashboardCardStyles } from './DashboardCard.styles';
import { DashboardCardCover } from './components/DashboardCardCover';
import { DashboardCardBody } from './components/DashboardCardBody';

dayjs.extend(durationPlugin);

function useDurationInSeconds({ duration }) {
  return useMemo(() => {
    if (duration) {
      const [value, unit] = duration.split(' ');
      return dayjs.duration({ [unit]: value }).asSeconds();
    }
    return null;
  }, [duration]);
}

export function useStudentState({ assignation = {} }) {
  if (!assignation) {
    return {};
  }

  const {
    instance,
    timestamps: { start, end },
  } = assignation;
  const {
    alwaysAvailable,
    dates: { deadline: _deadline, closed },
  } = instance;

  const now = dayjs();
  const deadline = dayjs(_deadline || null);
  const closeDate = dayjs(closed || null);
  const startTimestamp = dayjs(start || null);
  const endTimestamp = dayjs(end || null);

  const isFinished =
    (alwaysAvailable && closeDate.isValid()) ||
    endTimestamp.isValid() ||
    (deadline.isValid() && !deadline.isAfter(now));

  const isStartedByStudent = startTimestamp.isValid() && !startTimestamp.isAfter(now);

  return {
    isFinished,
    isStartedByStudent,
  };
}

function PreviewActions({ activity, localizations }) {
  const { id, roleDetails } = activity?.assignable ?? {};

  const url = roleDetails.previewUrl?.replace(':id', id);

  if (!url) {
    return null;
  }

  return (
    <Link to={url}>
      <Button size="sm">{localizations?.buttons?.preview}</Button>
    </Link>
  );
}

function TeacherActions({ activity, localizations }) {
  const { assignable, id } = activity;
  const { roleDetails } = assignable;

  return (
    <Link to={(roleDetails.dashboardURL || '/private/assignables/details/:id').replace(':id', id)}>
      <Button size="sm">{localizations?.buttons?.review}</Button>
    </Link>
  );
}

function StudentActions({ isBlocked, activity, assignation, localizations }) {
  const { assignable, id, requiresScoring, allowFeedback } = activity;
  const { roleDetails } = assignable;

  const { isFinished, isStartedByStudent } = useStudentState({ assignation });

  const activityUrl = roleDetails?.studentDetailUrl
    ?.replace(':id', id)
    ?.replace(':user', assignation?.user);

  const evaluationUrl = roleDetails?.evaluationDetailUrl
    ?.replace(':id', id)
    ?.replace(':user', assignation?.user);

  if (isFinished) {
    if (isBlocked) {
      return (
        <Button disabled size="sm">
          {localizations?.buttons?.review}
        </Button>
      );
    }
    if (!allowFeedback && !requiresScoring) {
      return (
        <Link to={activityUrl}>
          <Button size="sm">{localizations?.buttons?.review}</Button>
        </Link>
      );
    }
    return (
      <Link to={evaluationUrl}>
        <Button size="sm">{localizations?.buttons?.review}</Button>
      </Link>
    );
  }

  if (isBlocked) {
    return (
      <Button disabled size="sm">
        {isStartedByStudent ? localizations?.buttons?.continue : localizations?.buttons?.start}
      </Button>
    );
  }
  return (
    <Link to={activityUrl}>
      <Button size="sm">
        {isStartedByStudent ? localizations?.buttons?.continue : localizations?.buttons?.start}
      </Button>
    </Link>
  );
}

function Actions({ isBlocked, activity, assignation, localizations, preview }) {
  const isTeacher = useIsTeacher();
  const isStudent = useIsStudent();

  if (!activity) {
    return null;
  }

  if (preview) {
    return <PreviewActions activity={activity} localizations={localizations} />;
  }
  if (isTeacher) {
    return <TeacherActions activity={activity} localizations={localizations} />;
  }
  if (isStudent) {
    return (
      <StudentActions
        isBlocked={isBlocked}
        activity={activity}
        assignation={assignation}
        localizations={localizations}
      />
    );
  }

  return <></>;
}

export function DashboardCard({
  activity,
  assignation,
  isBlocked,
  localizations,
  preview,
  assetNumber,
}) {
  const {
    assignable,
    dates: { deadline },
  } = activity;
  const { asset, role, roleDetails } = assignable;
  const { name, description } = asset;
  const preparedAsset = prepareAsset(asset);

  const rolesLocalizations = useRolesLocalizations([role]);
  const evaluationTypeLocalizations = useEvaluationTypeLocalizations();
  const { classes } = useDashboardCardStyles();

  const durationSeconds = useDurationInSeconds(activity);
  const evaluationType = (evaluationTypeLocalizations ?? {})[useEvaluationType(activity)];

  const score = React.useMemo(() => {
    if (!activity.requiresScoring) {
      return null;
    }

    const grades = assignation.grades.filter((grade) => grade.type === 'main');
    const sum = grades.reduce((s, grade) => grade.grade + s, 0);
    return sum / grades.length;
  }, [assignation.grades, activity.requiresScoring]);

  return (
    <Box className={classes.root}>
      <DashboardCardCover
        asset={preparedAsset}
        assetNumber={assetNumber ?? 1}
        assignation={assignation}
        score={activity.requiresScoring && score}
        program={activity?.subjects?.[0]?.program}
        isCalificable={activity.requiresScoring}
        instance={activity}
      />
      <DashboardCardBody activity={activity} />
      {/* <Box>
        <Box className={classes.contentContainer}>
          <TextClamp lines={2}>
            <Text className={classes.name}>{name}</Text>
          </TextClamp>
          <TextClamp lines={6}>
            <Text className={classes.description}>{description}</Text>
          </TextClamp>
        </Box>
      </Box> */}
      <Box>
        {/* Evaluation type, duration and date */}
        {/* <Box className={classes.dataContainer}>
          <Text className={classes.dataBold}>{evaluationType}</Text>
          {!!durationSeconds && <Text className={classes.dataBold}>|</Text>}
          {!!durationSeconds && (
            <Text className={classes.dataBold}>
              <LocaleDuration seconds={durationSeconds} />
            </Text>
          )}
        </Box> */}
        {/* For now is always the same D: */}
        {!!deadline && (
          <Text className={classes.data}>
            <LocaleDate date={deadline} />
          </Text>
        )}

        {/* Footer */}
        <Box className={classes.footer}>
          {/* Role */}
          <Box className={classes.role}>
            <Box className={classes.icon}>
              <ImageLoader src={roleDetails?.icon} width={16} height={16} />
            </Box>
            <Text className={classes.type}>
              {capitalize(get(rolesLocalizations, `${role}.singular`))}
            </Text>
          </Box>
          {/* Actions */}
          <Box className={classes.actionsContainer}>
            <Actions
              isBlocked={isBlocked}
              activity={activity}
              assignation={assignation}
              localizations={localizations}
              preview={preview}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

DashboardCard.propTypes = {
  activity: PropTypes.object,
  assignation: PropTypes.object,
  isBlocked: PropTypes.bool,
  preview: PropTypes.bool,
  localizations: PropTypes.object,
};
