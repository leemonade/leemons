import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useModuleData } from '@learning-paths/components/ModuleDashboard/ModuleDashboard';
import { TotalLayoutContainer, Stack, TotalLayoutStepContainer } from '@bubbles-ui/components';

const ModuleJourney = () => {
  const { id } = useParams();
  const scrollRef = useRef();
  const { module, moduleAssignation, activities, activitiesById, assignationsById, isLoading } =
    useModuleData(id);
  console.log(module, moduleAssignation, activities, activitiesById, assignationsById, isLoading);
  return <div>ModuleJourney</div>;
};

export default ModuleJourney;
export { ModuleJourney };
