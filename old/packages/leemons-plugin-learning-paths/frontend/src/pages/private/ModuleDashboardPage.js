import { ModuleDashboard } from '@learning-paths/components/ModuleDashboard/ModuleDashboard';
import { ModuleAssignContextProvider } from '@learning-paths/contexts/ModuleAssignContext';
import React from 'react';
import { useParams } from 'react-router-dom';

export default function ModuleDashboardPage() {
  const { id } = useParams();

  return (
    <ModuleAssignContextProvider>
      <ModuleDashboard id={id} />
    </ModuleAssignContextProvider>
  );
}
