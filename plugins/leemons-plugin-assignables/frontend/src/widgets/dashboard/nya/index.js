import React from 'react';
import PropTypes from 'prop-types';
import { Box, ContextContainer, Button, Loader } from '@bubbles-ui/components';

import { Link } from 'react-router-dom';
import useClassData from '@assignables/hooks/useClassDataQuery';
import { useIsStudent } from '@academic-portfolio/hooks';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import { ActivityCarousel, EvaluationsCarousel, Header } from './components';
import {
  useEvaluatedActivities,
  useNyaActivities,
  useNyaLocalizations,
  useNyaStyles,
} from './hooks';

import { EmptyState } from './components/EmptyState/EmptyState';

export default function NYA({ classe, program }) {
  const localizations = useNyaLocalizations();
  const isStudent = useIsStudent();

  const activities = useNyaActivities({ program: program?.id, class: classe?.id });
  const evaluations = useEvaluatedActivities({ program: program?.id, class: classe?.id });

  const activitiesClassData = useClassData(activities.activities, localizations);
  const evaluationsClassData = useClassData(evaluations.activities, localizations);
  const { classes } = useNyaStyles();

  const isEmpty = isStudent
    ? activities.count === 0 && evaluations.count === 0
    : activities.count === 0;
  const isLoading = isStudent
    ? activities.isLoading || evaluations.isLoading
    : activities.isLoading;

  if (isLoading) {
    return <Loader />;
  }

  if (isEmpty) {
    return (
      <ContextContainer
        title={localizations?.nya?.emptyState?.title}
        titleRightZone={
          <Link to={'/private/assignables/ongoing'}>
            <Button variant="link" rightIcon={<ChevRightIcon />}>
              {localizations?.nya?.seeAllActivities}
            </Button>
          </Link>
        }
      >
        <EmptyState />
      </ContextContainer>
    );
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.section}>
        <Header
          {...activities}
          linkTo="/private/assignables/ongoing"
          titleLabel={
            isStudent ? localizations?.nya?.activitiesTitle : localizations?.nya?.evaluationsTitle
          }
          linkLabel={localizations?.nya?.seeAllActivities}
        />
        <ActivityCarousel
          {...activities}
          classData={activitiesClassData}
          localizations={localizations?.nya}
          showSubjects={!classe}
        />
      </Box>

      {isStudent && (
        <Box className={classes.section}>
          <Header
            {...evaluations}
            linkTo="/private/assignables/ongoing?progress=evaluated"
            titleLabel={localizations?.nya?.ownEvaluations}
            linkLabel={localizations?.nya?.seeAllEvaluations}
          />
          <EvaluationsCarousel
            {...evaluations}
            classData={evaluationsClassData}
            localizations={localizations?.nya}
            showSubjects={!classe}
          />
        </Box>
      )}
    </Box>
  );
}

NYA.propTypes = {
  classe: PropTypes.shape({
    id: PropTypes.string,
  }),
  program: PropTypes.shape({
    id: PropTypes.string,
  }),
};
