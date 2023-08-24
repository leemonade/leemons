import { ModuleDashboard } from '@learning-paths/components/ModuleDashboard/ModuleDashboard';
import { ModuleAssignContextProvider } from '@learning-paths/contexts/ModuleAssignContext';
import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

export default function ModuleDashboardPage({ preview }) {
  const { id } = useParams();

  return (
    <ModuleAssignContextProvider>
      <ModuleDashboard id={id} preview={!!preview} />
    </ModuleAssignContextProvider>
  );
}

ModuleDashboardPage.propTypes = {
  preview: PropTypes.bool,
};
