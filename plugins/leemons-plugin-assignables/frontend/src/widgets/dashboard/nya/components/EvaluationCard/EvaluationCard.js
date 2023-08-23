import React from 'react';
import { createStyles, Box, Text, TextClamp, ImageLoader } from '@bubbles-ui/components';
import prefixPN from '@assignables/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import { get } from 'lodash';
import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import { Link } from 'react-router-dom';
import ScoreFeedback from './components/ScoreFeedback';

function useRoleLocalization(role) {
  const localizationKey = prefixPN(`roles.${role}.singular`);

  const [, translations] = useTranslateLoader(localizationKey);

  return React.useMemo(() => {
    if (!translations?.items) {
      return '';
    }

    const res = unflatten(translations.items);
    const data = get(res, localizationKey);

    return data;
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
  text: theme.other.global.content.typoMobile.caption,
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

const useEvaluationCardStyles = createStyles((theme) => {
  const borderTheme = theme.other.global.border;

  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100%',
      border: `${borderTheme.width.md} solid ${borderTheme.color.line.muted}`,
      borderRadius: borderTheme.radius.md,
    },
    leftContainer: {
      paddingLeft: theme.spacing[5],
      paddingRight: theme.spacing[4],
      flex: '1 0',
      display: 'flex',
      flexDirection: 'column',
    },
    activityName: theme.other.global.content.typoMobile.heading.xsm,
    topLeftSection: {
      paddingTop: theme.spacing[4],
      borderBottom: `${theme.other.global.border.width.sm} solid ${theme.other.global.border.color.line.default}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: theme.spacing[2],
      paddingBottom: theme.spacing[3],
      flex: '1 0',
      minHeight: '50%',
    },
    botLeftSection: {
      paddingTop: theme.spacing[6],
      paddingBottom: theme.spacing[5],
      flex: '1 0',
      height: '50%',
    },
  };
});

export default function EvaluationCard({ assignation, showSubject, classData }) {
  const { instance } = assignation;
  const { assignable } = instance;
  const { asset, roleDetails } = assignable;

  const subject = {
    label: classData?.subjectName,
    icon: classData?.icon,
    color: classData?.color,
  };

  const score = React.useMemo(() => {
    if (!instance.requiresScoring) {
      return null;
    }

    const grades = assignation.grades.filter((grade) => grade.type === 'main');
    const sum = grades.reduce((s, grade) => grade.grade + s, 0);
    return sum / grades.length;
  }, [assignation.grades, instance.requiresScoring]);

  const { classes } = useEvaluationCardStyles();

  return (
    <Link
      to={roleDetails.evaluationDetailUrl
        ?.replace(':id', instance.id)
        ?.replace(':user', assignation.user)}
      style={{ textDecoration: 'none' }}
    >
      <Box className={classes.root}>
        <Box className={classes.leftContainer}>
          <Box className={classes.topLeftSection}>
            <TextClamp lines={2}>
              <Text className={classes.activityName}>{asset.name}</Text>
            </TextClamp>
            <RoleName role={assignable.roleDetails} />
          </Box>
          <Box className={classes.botLeftSection}>
            <SubjectItem subject={subject} />
          </Box>
        </Box>
        <Box>
          <Box>
            <ScoreFeedback
              program={instance?.subjects?.[0]?.program}
              isCalificable={instance.requiresScoring}
              score={instance.requiresScoring && score.toFixed(2)}
              rooms={instance.allowFeedback && assignation.chatKeys}
            />
          </Box>
          <Box></Box>
        </Box>
      </Box>
    </Link>
  );
}
