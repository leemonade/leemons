import React, { useState } from 'react';
import {
  createStyles,
  pxToRem,
  getBoxShadowFromToken,
  Box,
  Text,
  TextClamp,
  ImageLoader,
} from '@bubbles-ui/components';
import prefixPN from '@assignables/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import { get } from 'lodash';
import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import { Link } from 'react-router-dom';
import { ClassroomItemDisplay } from '@academic-portfolio/components';
import { RoomItemDisplay } from '@comunica/components';
import { EvaluationCardSkeleton } from '@assignables/components/EvaluationCard/EvaluationCardSkeleton';
import ScoreFeedback from './components/ScoreFeedback';

function useRoleLocalization(role) {
  const localizationKey = prefixPN(`roles.${role}.singular`);

  const [, translations] = useTranslateLoader(localizationKey);

  return React.useMemo(() => {
    if (!translations?.items) {
      return '';
    }

    const res = unflatten(translations.items);
    return get(res, localizationKey);
  }, [translations]);
}

const useRoleNameStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    height: theme.spacing[4],
  },
  icon: {
    position: 'relative',
    width: theme.spacing[4],
    height: theme.spacing[4],
    color: theme.other.global.content.color.text.default,
  },
  text: {
    color: theme.other.cardEvaluation.content.color.muted,
    ...theme.other.cardEvaluation.content.typo.sm,
  },
}));

const useSubjectItemStyles = createStyles((theme, { color }) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing[2],
    alignItems: 'center',
  },
  icon: {
    position: 'relative',
    width: theme.spacing[4],
    height: theme.spacing[4],
    maxWidth: theme.spacing[4],
    maxHeight: theme.spacing[4],
    filter: 'brightness(0) invert(1)',
  },
  iconContainer: {
    background: color,
    width: theme.spacing[7],
    height: theme.spacing[7],
    maxWidth: theme.spacing[7],
    maxHeight: theme.spacing[7],
    minWidth: theme.spacing[7],
    minHeight: theme.spacing[7],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
  },
  text: theme.other.global.content.typo.body['sm--bold'],
}));

function SubjectItem({ subject }) {
  const { classes } = useSubjectItemStyles({ color: subject?.color });
  return (
    <Box className={classes.root}>
      <Box className={classes.iconContainer}>
        <Box className={classes.icon}>
          <ImageLoader
            width={16}
            height={16}
            src={typeof subject?.icon === 'string' ? subject.icon : getClassIcon({ subject })}
          />
        </Box>
      </Box>
      <Text truncated className={classes.text}>
        {subject?.label}
      </Text>
    </Box>
  );
}

function RoleName({ role }) {
  const roleName = useRoleLocalization(role.name);
  const { classes } = useRoleNameStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.icon}>
        <ImageLoader src={role.icon} height={16} width={16} />
      </Box>
      <Text className={classes.text} transform="capitalize">
        {roleName}
      </Text>
    </Box>
  );
}

const useEvaluationCardStyles = createStyles((theme, { isHovered, color }) => {
  const { cardEvaluation } = theme.other;
  const getCardShadow = getBoxShadowFromToken(cardEvaluation.shadow.hover[0]);
  return {
    root: {
      borderRadius: cardEvaluation.border.radius.sm,
      border: `${cardEvaluation.border.width.sm} solid ${cardEvaluation.border.color.subtle}`,
      minHeight: pxToRem(212),
      maxHeight: pxToRem(212),
      maxWidth: pxToRem(536),
      minWidth: pxToRem(488),
      overflow: 'hidden',
      boxShadow: isHovered ? getCardShadow.boxShadow : 'none',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'inherit',
    },
    color: {
      backgroundColor: color,
      width: 4,
      height: pxToRem(212),
    },
    leftContainer: {
      padding: `${cardEvaluation.spacing.padding.horizontal.md} ${cardEvaluation.spacing.padding.vertical.md}`,
      minWidth: pxToRem(324),
      maxWidth: pxToRem(372),
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      marginLeft: 0,
    },
    activityName: {
      ...cardEvaluation.content.typo.lg,
      color: cardEvaluation.content.color.emphasis,
      marginRight: cardEvaluation.spacing.padding.vertical.md,
      width: 'auto',
      paddingBottom: cardEvaluation.spacing.gap.xlg,
    },
    delivered: {
      color: cardEvaluation.content.color.subje,
      ...cardEvaluation.content.typo['sm--medium'],
    },
    footer: {
      display: 'flex',
      width: 'auto',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'absolute',
      bottom: pxToRem(16),
      right: pxToRem(16),
      left: pxToRem(16),
    },
  };
});

export default function EvaluationCard({ assignation }) {
  const { instance } = assignation;
  const { assignable } = instance;
  const { asset, roleDetails } = assignable;

  const [isHovered, setIsHovered] = useState(false);

  const score = React.useMemo(() => {
    if (!instance.requiresScoring) {
      return null;
    }

    const grades = assignation.grades.filter((grade) => grade.type === 'main');
    const sum = grades.reduce((s, grade) => grade.grade + s, 0);
    return sum / grades.length;
  }, [assignation.grades, instance.requiresScoring]);
  const color = asset?.color;

  const { classes } = useEvaluationCardStyles({ isHovered, color });
  const dateDelivered =
    instance?.dates?.deadline && new Date(instance?.dates?.deadline).toLocaleDateString();

  if (!assignation) return <EvaluationCardSkeleton />;
  return (
    <Link
      to={roleDetails.evaluationDetailUrl
        ?.replace(':id', instance.id)
        ?.replace(':user', assignation.user)}
      style={{ textDecoration: 'none' }}
    >
      <Box
        className={classes.root}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box className={classes.color} />
        <Box className={classes.leftContainer}>
          <Box className={classes.topLeftSection}>
            <TextClamp lines={2}>
              <Text className={classes.activityName}>{asset.name}</Text>
            </TextClamp>
          </Box>
          <Box className={classes.botLeftSection}>
            <ClassroomItemDisplay classroomIds={instance?.classes} showSubject={true} />
          </Box>
          <Box>
            <Text className={classes.delivered}>{dateDelivered}</Text>
          </Box>
          <Box className={classes.footer}>
            <RoleName role={assignable?.roleDetails} />
            <RoomItemDisplay chatKeys={instance.allowFeedback && assignation.chatKeys} />
          </Box>
        </Box>
        <Box>
          <ScoreFeedback
            program={instance?.subjects?.[0]?.program}
            isCalificable={instance.requiresScoring}
            score={instance.requiresScoring && score}
            instance={instance}
          />
        </Box>
      </Box>
    </Link>
  );
}
