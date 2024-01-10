import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useModuleData } from '@learning-paths/components/ModuleDashboard/ModuleDashboard';
import {
  TotalLayoutContainer,
  Stack,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
  Button,
} from '@bubbles-ui/components';
import ActivityHeader from '@assignables/components/ActivityHeader/index';
import { Introduction } from './steps/Introduction';

const ModuleJourney = () => {
  const { id } = useParams();
  const scrollRef = useRef();
  const { module, moduleAssignation, activities, activitiesById, assignationsById, isLoading } =
    useModuleData(id);
  return (
    <TotalLayoutContainer
      ref={scrollRef}
      Header={<ActivityHeader instance={module} showClass showDeadline />}
    >
      <Stack justifyContent="center" ref={scrollRef} style={{ overflow: 'auto' }}>
        <TotalLayoutStepContainer
          Footer={
            <TotalLayoutFooterContainer
              scrollRef={scrollRef}
              rightZone={<Button>Siguiente actividad</Button>}
              fixed
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
