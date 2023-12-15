import React, { useState } from 'react';
import { Box, Text, TextClamp } from '@bubbles-ui/components';
import { Link } from 'react-router-dom';
import { ClassroomItemDisplay } from '@academic-portfolio/components';
import { RoomItemDisplay } from '@comunica/components';
import { EvaluationCardSkeleton } from '@assignables/components/EvaluationCard/EvaluationCardSkeleton';
import {
  EVALUATIONCARDRIGHTELEMENT_DEFAULT_PROPS,
  EVALUATIONCARDRIGHTELEMENT_PROP_TYPES,
} from '@assignables/components/EvaluationCard/EvaluationCardRightElement/EvaluationCardRightElement.constants';
import { useEvaluationCardStyles } from './EvaluationCardStudent.styles';
import ScoreFeedback from './components/ScoreFeedback';
import { RoleName } from './components/RoleName';

export default function EvaluationCardStudent({ assignation }) {
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
            totalActivities={10}
            submitedActivities={5}
          />
        </Box>
      </Box>
    </Link>
  );
}

EvaluationCardStudent.propTypes = EVALUATIONCARDRIGHTELEMENT_PROP_TYPES;
EvaluationCardStudent.defaultProps = EVALUATIONCARDRIGHTELEMENT_DEFAULT_PROPS;
