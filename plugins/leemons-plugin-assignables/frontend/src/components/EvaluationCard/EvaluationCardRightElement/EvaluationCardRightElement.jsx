import { useState, useEffect } from 'react';

import { Box, Badge, Text, ProgressRing } from '@bubbles-ui/components';
import dayjs from 'dayjs';

import { getActivityType } from '../../../helpers/getActivityType';

import {
  EVALUATIONCARDRIGHTELEMENT_DEFAULT_PROPS,
  EVALUATIONCARDRIGHTELEMENT_PROP_TYPES,
} from './EvaluationCardRightElement.constants';
import { EvaluationCardRightElementStyles } from './EvaluationCardRightElement.styles';

import { usePendingEvaluationsCount } from '@assignables/hooks/assignableInstance/usePendingEvaluationsCount';

const EvaluationCardRightElement = ({ instance, localizations }) => {
  const [calificationType, setCalificationType] = useState(null);
  const [notModuleData, setNotModuleData] = useState({});
  const isModule = instance?.assignable?.role === 'learningpaths.module';
  const { classes } = EvaluationCardRightElementStyles();
  const { pendingEvaluationActivitiesCount } = usePendingEvaluationsCount({
    instance,
  });

  const getInstanceTypeLocale = (instanceParam) => {
    const activityType = getActivityType(instanceParam);
    const localizationType = localizations?.assignmentForm?.evaluation?.typeInput?.options;
    const activityTypeLocale = {
      calificable: localizationType?.calificable,
      puntuable: localizationType?.punctuable,
      feedback: localizationType?.feedback,
    };
    setCalificationType(activityTypeLocale[activityType]);
  };

  const getPercentageNotModule = () => {
    let counter = 0;
    const numberOfStudents = instance?.students?.length;

    const activityReachedDeadline =
      instance?.dates?.deadline && dayjs(instance?.dates?.deadline).isBefore(dayjs());
    const activityIsClosed = instance?.dates?.closed || activityReachedDeadline;

    const numberOfSubjects = instance?.subjects?.length;

    instance?.students?.forEach((student) => {
      const studentDidSubmit = student?.timestamps?.end;
      const numberOfGrades = student?.grades?.filter((grade) => grade.type === 'main')?.length;
      const isFullyGraded = numberOfGrades === numberOfSubjects;

      if (!isFullyGraded && (studentDidSubmit || activityIsClosed)) {
        counter++;
      }
    });
    return {
      percentage: Math.round((counter / numberOfStudents) * 100),
      numberOfStudents,
      counter,
    };
  };

  useEffect(() => {
    getInstanceTypeLocale(instance);
    if (!isModule && instance?.students) {
      setNotModuleData(getPercentageNotModule());
    }
  }, [instance]);

  const { percentage, counter, numberOfStudents } = notModuleData;

  return (
    <Box className={classes.root}>
      {calificationType && (
        <Badge closable={false} size="xs" className={classes.calificationBadge}>
          <Text className={classes.badgeText}>{calificationType?.toUpperCase()}</Text>
        </Badge>
      )}
      {isModule ? (
        <Box className={classes.commonContainer}>
          <Box>
            <Text className={classes.submitedNumber}>{pendingEvaluationActivitiesCount}</Text>
          </Box>
          <Box className={classes.pendigLabelContainer}>
            <Text className={classes.pendingLabel}>
              {localizations?.ongoing?.pendingActivities}
            </Text>
          </Box>
        </Box>
      ) : (
        <Box className={classes.commonContainer}>
          <ProgressRing
            rootColor={'#DDE1E6'}
            sections={[{ value: notModuleData?.percentage, color: '#307AE8' }]}
            label={
              <Box className={classes.labelPercentage}>
                <Text className={classes.textPercentage}>{`${percentage}%`}</Text>
              </Box>
            }
          />
          <Text>{`(${counter}/${numberOfStudents} ${localizations?.assignment_list?.teacher.students.toLowerCase()})`}</Text>
        </Box>
      )}
    </Box>
  );
};

EvaluationCardRightElement.defaultProps = EVALUATIONCARDRIGHTELEMENT_DEFAULT_PROPS;
EvaluationCardRightElement.propTypes = EVALUATIONCARDRIGHTELEMENT_PROP_TYPES;
EvaluationCardRightElement.displayName = 'EvaluationCardRightElement';

export default EvaluationCardRightElement;
export { EvaluationCardRightElement };
