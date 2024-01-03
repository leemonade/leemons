import React, { useState, useEffect } from 'react';
import { Box, Text, TextClamp, Badge } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPn from '@learning-paths/helpers/prefixPN';
import { SubjectItemDisplay } from '@academic-portfolio/components';
import { useDashboardCardBodyStyles } from './DashboardCardBody.styles';
import {
  DASHBOARD_CARD_BODY_DEFAULT_PROPS,
  DASHBOARD_CARD_BODY_PROP_TYPES,
} from './DashboardCardBody.constants';
import { getActivityType } from '../../../../helpers/getActivityType';

const DashboardCardBody = ({ activity }) => {
  const [calificationType, setCalificationType] = useState();
  const [t] = useTranslateLoader(prefixPn('moduleCardBadge.options'));
  const { classes } = useDashboardCardBodyStyles();
  const {
    assignable,
    dates: { deadline },
  } = activity;
  const { asset, role, roleDetails } = assignable;
  const { name, description } = asset;
  const getInstanceTypeLocale = (instanceParam) => {
    const activityType = getActivityType(instanceParam);
    const activityTypeLocale = {
      calificable: t('calificable'),
      puntuable: t('punctuable'),
      no_evaluable: t('nonEvaluable'),
      feedback: t('feedback'),
    };
    setCalificationType(activityTypeLocale[activityType]);
  };
  useEffect(() => {
    getInstanceTypeLocale(activity);
  }, [activity]);
  // const subjectIds = [activity?.subjects[0]?.subject];
  return (
    <Box className={classes.root}>
      {calificationType && (
        <Badge closable={false} size="xs" className={classes.calificationBadge}>
          <Text className={classes.draftText}>{calificationType?.toUpperCase()}</Text>
        </Badge>
      )}
      <Box>
        <Box className={classes.contentContainer}>
          <TextClamp lines={2}>
            <Text className={classes.title}>{name}</Text>
          </TextClamp>
          <TextClamp lines={2}>
            <Text className={classes.description}>{description}</Text>
          </TextClamp>
        </Box>
      </Box>
      <Box className={classes.subject}>
        <SubjectItemDisplay subjectsIds={[1, 2]} />
      </Box>
    </Box>
  );
};

DashboardCardBody.propTypes = DASHBOARD_CARD_BODY_PROP_TYPES;
DashboardCardBody.defaultProps = DASHBOARD_CARD_BODY_DEFAULT_PROPS;
DashboardCardBody.displayName = 'DashboardCardBody';

export default DashboardCardBody;
export { DashboardCardBody };
