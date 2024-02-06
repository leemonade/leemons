import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useModuleData } from '@learning-paths/components/ModuleDashboard/ModuleDashboard';
import {
  TotalLayoutContainer,
  Stack,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
  Button,
} from '@bubbles-ui/components';
import ActivityHeader from '@assignables/components/ActivityHeader/index';
import { sortBy } from 'lodash';
import { useIsTeacher } from '@academic-portfolio/hooks';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@tasks/helpers';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import { Introduction } from './steps/Introduction';

const ModuleJourney = () => {
  const [t] = useTranslateLoader([prefixPN('task_realization.buttons')]);
  const isTeacher = useIsTeacher();
  const { id } = useParams();
  const scrollRef = useRef();
  const { module, moduleAssignation, activitiesById } = useModuleData(id);

  const orderedActivities = sortBy(activitiesById, 'createdAt');
  const assignablesURL = (
    orderedActivities[0]?.assignable?.roleDetails?.dashboardURL ||
    '/private/assignables/details/:id'
  ).replace(':id', orderedActivities[0]?.id);
  const activityUrl = orderedActivities[0]?.assignable?.roleDetails?.studentDetailUrl
    ?.replace(':id', orderedActivities[0]?.id)
    ?.replace(':user', moduleAssignation?.user);

  const evaluationUrl = orderedActivities[0]?.assignable?.roleDetails?.evaluationDetailUrl
    ?.replace(':id', orderedActivities[0]?.id)
    ?.replace(':user', moduleAssignation?.user);

  const handleButtonUrl = () => {
    if (isTeacher) {
      return assignablesURL;
    }
    if (moduleAssignation?.finished) {
      return evaluationUrl;
    }
    return activityUrl;
  };

  return (
    <TotalLayoutContainer
      ref={scrollRef}
      Header={<ActivityHeader instance={module} showClass showDeadline />}
    >
      <Stack
        justifyContent="center"
        ref={scrollRef}
        style={{ overflow: 'auto' }}
        fullWidth
        fullHeight
      >
        <TotalLayoutStepContainer
          Footer={
            <TotalLayoutFooterContainer
              fixed
              scrollRef={scrollRef}
              rightZone={
                <Link to={handleButtonUrl()}>
                  <Button rightIcon={<ChevRightIcon />}>{t('nextActivity')}</Button>
                </Link>
              }
            />
          }
        >
          <Introduction instance={module} />
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
};

export default ModuleJourney;
export { ModuleJourney };
