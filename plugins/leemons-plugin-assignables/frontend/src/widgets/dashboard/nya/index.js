import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  ContextContainer,
  ImageLoader,
  Loader,
  Stack,
  Text,
} from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import { Link } from 'react-router-dom';

import useClassData from '@assignables/hooks/useClassDataQuery';
import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import useWelcome from '@dashboard/request/hooks/queries/useWelcome';
import { ActivityCarousel, EvaluationsCarousel, Header } from './components';
import {
  useEvaluatedActivities,
  useNyaActivities,
  useNyaLocalizations,
  useNyaStyles,
} from './hooks';
import NyaEmpty from '../../../assets/emptyStates/nya.svg';

function EmptyState() {
  const localizations = useNyaLocalizations()?.nya;
  const isTeacher = useIsTeacher();

  return (
    <Stack spacing={6} direction="column" alignItems="center" fullWidth>
      <Stack spacing={4} direction="column">
        <Text
          sx={(theme) => ({ ...theme.other.global.content.typo.heading.lg, textAlign: 'center' })}
        >
          {localizations?.emptyState?.title}
        </Text>
        <Text sx={(theme) => ({ ...theme.other.global.content.typo.body.lg, textAlign: 'center' })}>
          {isTeacher
            ? localizations?.emptyState?.noEvaluations
            : localizations?.emptyState?.noActivities}
        </Text>
      </Stack>
      <ImageLoader src={NyaEmpty} style={{ position: 'relative' }} width={240} height={240} />
    </Stack>
  );
}

export default function NYA({ classe, program }) {
  const localizations = useNyaLocalizations();
  const isStudent = useIsStudent();
  const { data: welcomeCompleted } = useWelcome();

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

  if (!welcomeCompleted) {
    return null;
  }

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
