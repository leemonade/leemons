import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { Badge, Box, Stack, Text, TextClamp } from '@bubbles-ui/components';

import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import getNearestScale from '@scorm/helpers/getNearestScale';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import useActivityScoreDisplayStyles from './ActivityScoreDisplay.styles';

export default function ActivityScoreDisplay({ activity = {}, evaluationSystem }) {
  const [t] = useTranslateLoader(prefixPN('myScores'));
  const { instance, mainGrade } = activity;
  const { assignable } = instance ?? {};
  const { role, roleDetails } = assignable ?? {};

  const roleLocalizations = useRolesLocalizations([role]);
  const evaluationDetailUrl = roleDetails.evaluationDetailUrl
    ?.replace(':id', activity.instance.id)
    .replace(':user', activity.user);

  const scale = getNearestScale({ grade: mainGrade, evaluationSystem });

  const { classes } = useActivityScoreDisplayStyles();

  const body = (
    <Stack className={classes.root} justifyContent="space-between" alignItems="center" fullWidth>
      {/*
        === Left side ===
      */}
      <Stack direction="column" className={classes.leftSide}>
        <Stack direction="row" spacing={1} alignItems="baseline">
          <Text transform="uppercase" className={classes.role}>
            {roleLocalizations[role]?.singular}
          </Text>
          {!activity.instance.requiresScoring && (
            <Text className={classes.nonScoringActivity} color="warning">
              {t('noEvaluable')}
            </Text>
          )}
        </Stack>
        <TextClamp lines={1}>
          <Text className={classes.activityName}>{assignable?.asset?.name}</Text>
        </TextClamp>
      </Stack>

      {/*
        === Right side ===
      */}
      <Stack direction="column" spacing={1} className={classes.rightSide} alignItems="center">
        <Box className={classes.badge}>
          {!activity.hasNoWeight && activity.instance.requiresScoring && (
            <Badge closable={false} color="stroke">
              {parseFloat((activity.weight * 100).toFixed(2))}%
            </Badge>
          )}
        </Box>
        <Text className={classes.score}>
          {(mainGrade ? scale?.letter ?? mainGrade : null) ?? '-'}
        </Text>
      </Stack>
    </Stack>
  );

  if (evaluationDetailUrl) {
    return (
      <Link to={evaluationDetailUrl} className={classes.noLink}>
        {body}
      </Link>
    );
  }

  return body;
}

ActivityScoreDisplay.propTypes = {
  activity: PropTypes.shape({
    instance: PropTypes.shape({
      requiresScoring: PropTypes.bool,
      id: PropTypes.string,
    }),
    assignable: PropTypes.shape({
      asset: PropTypes.shape({
        name: PropTypes.string,
      }),
      role: PropTypes.string,
      roleDetails: PropTypes.shape({
        evaluationDetailUrl: PropTypes.string,
      }),
    }),
    mainGrade: PropTypes.number,
    weight: PropTypes.number,
    hasNoWeight: PropTypes.bool,
    user: PropTypes.string,
  }).isRequired,
  evaluationSystem: PropTypes.object.isRequired,
};
