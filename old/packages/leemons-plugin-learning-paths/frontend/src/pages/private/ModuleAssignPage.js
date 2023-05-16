import { ModuleAssign } from '@learning-paths/components/ModuleAssign/ModuleAssign';
import { ModuleAssignContextProvider } from '@learning-paths/contexts/ModuleAssignContext';
import React from 'react';
import { useParams } from 'react-router-dom';

export default function ModuleAssignPage() {
  const { id } = useParams();

  return (
    <ModuleAssignContextProvider>
      <ModuleAssign id={id} />
    </ModuleAssignContextProvider>
  );
}
