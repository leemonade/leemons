/* eslint-disable react/prop-types */
import React from 'react';
import { Box, Text, ImageLoader, Button } from '@bubbles-ui/components';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { Link } from 'react-router-dom';
import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import { capitalize, get } from 'lodash';
import { LockIcon } from '@bubbles-ui/icons/solid';
import { useDashboardCardFooterStyles } from './DashboardCardFooter.styles';
import { EvaluationStateDisplay } from '../EvaluationStateDisplay';
import {
  DASHBOARD_CARD_FOOTER_DEFAULT_PROPS,
  DASHBOARD_CARD_FOOTER_PROP_TYPES,
} from './DashboardCardFooter.constants';

dayjs.extend(durationPlugin);
export function useStudentState({ assignation = {} }) {
  if (!assignation) {
    return {};
  }

  const { instance, timestamps: { start = null, end = null } = {}, grades } = assignation;
  const { alwaysAvailable, dates: { deadline: _deadline = null, closed = null } = {} } =
    instance || {};

  const now = dayjs();
  const deadline = dayjs(_deadline);
  const closeDate = dayjs(closed);
  const startTimestamp = dayjs(start);
  const endTimestamp = dayjs(end);

  const isFinished =
    (alwaysAvailable && closeDate.isValid()) ||
    endTimestamp.isValid() ||
    (deadline.isValid() && !deadline.isAfter(now));

  const isStartedByStudent = startTimestamp.isValid() && !startTimestamp.isAfter(now);
  const isFinishedButNotGraded = isFinished && grades?.length === 0;
  const isFinishedAndGraded = isFinished && grades?.length > 0;

  return {
    isFinished,
    isStartedByStudent,
    isFinishedButNotGraded,
    isFinishedAndGraded,
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

function TeacherActions({ activity, localizations, evaluationInfo }) {
  const { assignable, id } = activity;
  const { roleDetails } = assignable;
  const { classes } = useDashboardCardFooterStyles();
  const isNoEvaluable = !activity.requiresScoring;
  const assignablesURL = (roleDetails.dashboardURL || '/private/assignables/details/:id').replace(
    ':id',
    id
  );

  if (evaluationInfo?.state === 'allEvaluated') {
    return (
      <Box className={classes.buttonFull}>
        <Link to={assignablesURL}>
          <Button fullWidth variant="link">
            {localizations?.buttons?.viewReport}
          </Button>
        </Link>
      </Box>
    );
  }

  if (evaluationInfo?.state === 'someDeliveredButNotAll' && !isNoEvaluable) {
    return (
      <Box className={classes.buttonFull}>
        <Link to={assignablesURL}>
          <Button fullWidth>{localizations?.buttons?.forEvaluate}</Button>
        </Link>
      </Box>
    );
  }
  if (evaluationInfo?.state === 'openedButNotStarted') {
    return (
      <Box className={classes.buttonFull}>
        <Link to={assignablesURL}>
          <Button fullWidth variant="outline">
            {localizations?.buttons?.viewProgress}
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box className={classes.buttonFull}>
      <Link to={assignablesURL}>
        <Button fullWidth variant={isNoEvaluable ? 'outline' : 'primary'}>
          {localizations?.buttons?.review}
        </Button>
      </Link>
    </Box>
  );
}

function StudentActions({ isBlocked, activity, assignation, localizations }) {
  const { classes } = useDashboardCardFooterStyles();
  const { assignable, id, requiresScoring, allowFeedback } = activity;
  const { roleDetails } = assignable;

  const { isFinished, isStartedByStudent, isFinishedButNotGraded, isFinishedAndGraded } =
    useStudentState({
      assignation,
    });

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
        <Box className={classes.buttonContainer}>
          <EvaluationStateDisplay state={false} />
          <Link to={activityUrl}>
            <Button variant="outline" style={{ paddingLeft: '40px', paddingRight: '40px' }}>
              {localizations?.buttons?.review}
            </Button>
          </Link>
        </Box>
      );
    }
    if (isFinishedButNotGraded) {
      return (
        <Box className={classes.buttonContainer}>
          <EvaluationStateDisplay state={false} />
          <Link to={activityUrl}>
            <Button variant="outline" style={{ paddingLeft: '40px', paddingRight: '40px' }}>
              {localizations?.buttons?.review}
            </Button>
          </Link>
        </Box>
      );
    }
    if (isFinishedAndGraded) {
      return (
        <Box className={classes.buttonContainer}>
          <EvaluationStateDisplay state={true} />
          <Link to={evaluationUrl}>
            <Button size="sm" variant="outline">
              {localizations?.buttons?.viewEvaluation}
            </Button>
          </Link>
        </Box>
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
      <Box className={classes.buttonFull}>
        <Button disabled fullWidth leftIcon={<LockIcon />}>
          {isStartedByStudent
            ? localizations?.buttons?.continue
            : localizations?.buttons?.notAvailable}
        </Button>
      </Box>
    );
  }
  return (
    <Box className={classes.buttonFull}>
      <Link to={activityUrl}>
        <Button fullWidth>
          {isStartedByStudent ? localizations?.buttons?.continue : localizations?.buttons?.start}
        </Button>
      </Link>
    </Box>
  );
}

function Actions({ isBlocked, activity, assignation, localizations, preview, evaluationInfo }) {
  const isTeacher = useIsTeacher();
  const isStudent = useIsStudent();

  if (!activity) {
    return null;
  }

  if (preview) {
    return <PreviewActions activity={activity} localizations={localizations} />;
  }
  if (isTeacher) {
    return (
      <TeacherActions
        activity={activity}
        localizations={localizations}
        evaluationInfo={evaluationInfo}
      />
    );
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

const DashboardCardFooter = ({
  isBlocked,
  activity,
  assignation,
  localizations,
  preview,
  role,
  roleDetails,
  rolesLocalizations,
  introductionLink,
  evaluationInfo,
}) => {
  const { classes } = useDashboardCardFooterStyles();
  const isTeacher = useIsTeacher();

  if (introductionLink && localizations) {
    return (
      <Box className={classes.root}>
        <Box className={classes.buttonFull}>
          <Link to={introductionLink}>
            <Button fullWidth variant={isTeacher ? 'outline' : 'primary'}>
              {localizations?.buttons?.review}
            </Button>
          </Link>
        </Box>
      </Box>
    );
  }
  return (
    <Box className={classes.root}>
      <Box className={classes.footer}>
        <Box className={classes.role}>
          <Box className={classes.icon}>
            <ImageLoader src={roleDetails?.icon} width={16} height={16} />
          </Box>
          <Text className={classes.type}>
            {capitalize(get(rolesLocalizations, `${role}.singular`))}
          </Text>
        </Box>
        <Box className={classes.actionsContainer}>
          <Actions
            isBlocked={isBlocked}
            activity={activity}
            assignation={assignation}
            localizations={localizations}
            preview={preview}
            evaluationInfo={evaluationInfo}
          />
        </Box>
      </Box>
    </Box>
  );
};

DashboardCardFooter.propTypes = DASHBOARD_CARD_FOOTER_PROP_TYPES;
DashboardCardFooter.defaultProps = DASHBOARD_CARD_FOOTER_DEFAULT_PROPS;

export default DashboardCardFooter;
export { DashboardCardFooter };
