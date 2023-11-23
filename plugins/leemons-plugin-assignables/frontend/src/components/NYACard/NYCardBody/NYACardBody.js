/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect } from 'react';
import { Box, Badge, Text, TextClamp } from '@bubbles-ui/components';
import { isArray } from 'lodash';
// import { useQueryClient } from '@tanstack/react-query';
import getActivityType from '@assignables/helpers/getActivityType';
import { ClassroomItemDisplay } from '@academic-portfolio/components';
import { NYACARD_BODY_PROP_TYPES, NYACARD_BODY_DEFAULT_PROPS } from './NYACardBody.constants';
import { NYACardBodyStyles } from './NYACardBody.styles';
// import { FavButton } from '../FavButton';
// import { pinAssetRequest, unpinAssetRequest } from '../../request';

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
  ...props
}) => {
  const { classes } = NYACardBodyStyles({ fullHeight }, { name: 'NYACardBody' });
  // const [isFav, setIsFav] = useState(pinned);
  const [calificationType, setCalificationType] = useState(null);
  const instanceChild = instance;
  const getInstanceTypeLocale = (instanceParam) => {
    const activityType = getActivityType(instanceParam);
    const localizationType = localizations?.assignmentForm?.evaluation?.typeInput?.options;
    const activityTypeLocale = {
      calificable: localizationType.calificable,
      puntuable: localizationType.punctuable,
      no_evaluable: localizationType.nonEvaluable,
    };
    setCalificationType(activityTypeLocale[activityType]);
  };

  useEffect(() => {
    getInstanceTypeLocale(instanceChild);
  }, [instance]);
  const [subjectData, setSubjectData] = useState(null);
  // const queryClient = useQueryClient();
  const title = props.name ? props.name : null;

  // const handleIsFav = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (isFav) {
  //     unpinAssetRequest(id);
  //     setIsFav(false);
  //     queryClient.invalidateQueries({ queryKey: ['fetch-assets-data'] });
  //     queryClient.refetchQueries();
  //   } else {
  //     pinAssetRequest(id);
  //     setIsFav(true);
  //   }
  // };

  // useEffect(() => {
  //   if (isArray(subjects)) {
  //     const subjectIds = subjects.map((s) => s.subject);
  //     setSubjectData(subjectIds);
  //   } else if (!isArray(subjects) && subjects?.name) {
  //     setSubjectData(subjects);
  //   }
  // }, [subjects]);
  const newLocale = localizations.new.toUpperCase();
  const formattedDate =
    instance?.deadlineProps?.deadline instanceof Date
      ? `${instance?.deadlineProps?.deadline.toLocaleDateString(
        locale
      )} - ${instance?.deadlineProps?.deadline.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
      })}`
      : '';

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Box className={classes.badgesContainer}>
          {isNew && (
            <Badge closable={false} size="xs" className={classes.newBadge}>
              <Text className={classes.draftText}>{newLocale}</Text>
            </Badge>
          )}
          {calificationType && (
            <Badge closable={false} size="xs" className={classes.calificationBadge}>
              <Text className={classes.draftText}>{calificationType?.toUpperCase()}</Text>
            </Badge>
          )}
        </Box>
        {/* {isNew && ( */}
      </Box>
      <Box className={classes.titleContainer}>
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
              {description}
            </Text>
          </TextClamp>
        )}
      </Box>
      <Box className={classes.subject}>
        <ClassroomItemDisplay classroomIds={classroom} />
      </Box>
      <Box>
        <Text>{formattedDate}</Text>
      </Box>
    </Box>
  );
};
NYACardBody.defaultProps = NYACARD_BODY_DEFAULT_PROPS;
NYACardBody.propTypes = NYACARD_BODY_PROP_TYPES;
export { NYACardBody };
