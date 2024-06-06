/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect } from 'react';
import { Box, Badge, Text, TextClamp, ProgressColorBar } from '@bubbles-ui/components';
import getActivityType from '@assignables/helpers/getActivityType';
import { ClassroomItemDisplay } from '@academic-portfolio/components';
import getColorByDateRange from '@assignables/helpers/getColorByDateRange';
import { htmlToText } from '@common';
import { NYACARD_BODY_PROP_TYPES, NYACARD_BODY_DEFAULT_PROPS } from './NYACardBody.constants';
import { NYACardBodyStyles } from './NYACardBody.styles';
import { getDeadlineData } from '../../../helpers/getDeadlineData';

const NYACardBody = ({
  description,
  variant,
  fullHeight,
  published,
  subjects,
  providerData,
  program,
  pinned,
  id,
  isNew,
  localizations,
  instance,
  classroom,
  locale,
  totalActivities,
  submitedActivities,
  showSubject,
  isTeacherSyllabus,
  ...props
}) => {
  const { classes } = NYACardBodyStyles({ fullHeight }, { name: 'NYACardBody' });
  const [calificationType, setCalificationType] = useState(null);
  const hasProgressBar = totalActivities && totalActivities > 0;
  const activitiesPercentage = hasProgressBar && (submitedActivities / totalActivities) * 100;
  const getDescription = () => {
    if (instance?.assignable?.role === 'feedback') {
      return instance?.assignable?.instructionsForStudents
        ? htmlToText(instance?.assignable?.instructionsForStudents)
        : description;
    }
    if (instance?.assignable?.role === 'task' || instance?.assignable?.role === 'test') {
      return instance?.assignable?.statement
        ? htmlToText(instance?.assignable?.statement)
        : description;
    }
    return description;
  };
  const cardDescription = getDescription();

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

  useEffect(() => {
    getInstanceTypeLocale(instance);
  }, [instance]);
  const title = props.name ? props.name : null;
  const isModule = instance?.assignable?.role === 'learningpaths.module';
  const newLocale = localizations?.new?.toUpperCase();

  const deadLineLocales = localizations?.deadline;
  const activitiesLocale = localizations?.ongoing?.activities.toLowerCase();

  const formattedDeadline = getDeadlineData(
    instance?.deadlineProps?.deadline,
    instance?.dates?.visualization,
    deadLineLocales
  );
  const deadlineColors = getColorByDateRange(
    instance?.deadlineProps?.deadline,
    instance?.dates?.visualization
  );
  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Box className={classes.badgesContainer}>
          {isNew && (
            <Badge closable={false} size="xs" className={classes.newBadge}>
              <Text className={classes.draftText}>{newLocale}</Text>
            </Badge>
          )}
          {calificationType && !isModule && (
            <Badge closable={false} size="xs" className={classes.calificationBadge}>
              <Text className={classes.draftText}>{calificationType?.toUpperCase()}</Text>
            </Badge>
          )}
        </Box>
      </Box>
      <Box style={{ paddingTop: isNew || calificationType ? 12 : 0 }}>
        {title && (
          <TextClamp lines={2}>
            <Text className={classes.title}>{title}</Text>
          </TextClamp>
        )}
      </Box>
      <Box>
        {description && (
          <TextClamp lines={2}>
            <Text size="xs" className={classes.description}>
              {cardDescription}
            </Text>
          </TextClamp>
        )}
      </Box>
      <Box className={classes.subject}>
        <ClassroomItemDisplay classroomIds={classroom} showSubject={showSubject} />
      </Box>
      <Box className={classes.deadline}>
        <Text className={classes.deadlineDate}>{`${formattedDeadline.date} - `}</Text>
        <Text className={classes.deadlineDate} style={{ color: deadlineColors }}>
          {formattedDeadline.status}
        </Text>
      </Box>
      {!!activitiesPercentage && isModule && !isTeacherSyllabus && (
        <Box className={classes.progress}>
          <ProgressColorBar
            value={activitiesPercentage}
            size={'md'}
            color={'#F39C12'}
            labelLeft={`Progreso: ${Math.floor(activitiesPercentage)}%`}
            labelRight={`(${submitedActivities}/${totalActivities} ${activitiesLocale})`}
          />
        </Box>
      )}
    </Box>
  );
};
NYACardBody.defaultProps = NYACARD_BODY_DEFAULT_PROPS;
NYACardBody.propTypes = NYACARD_BODY_PROP_TYPES;
export { NYACardBody };
