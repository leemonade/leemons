import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDeploymentConfig } from '@deployment-manager/hooks/useDeploymentConfig';
import { Dashboard } from './components/Dashboard';

function AdminDashboard(props) {
  const history = useHistory();
  const deploymentConfig = useDeploymentConfig({ pluginName: 'dashboard', ignoreVersion: true });

  if (typeof deploymentConfig === 'undefined') {
    return null;
  }

  if (deploymentConfig?.adminDashboardUrl) {
    history.push(deploymentConfig.adminDashboardUrl);
    return null;
  }

  return <Dashboard {...props} />;
}

export { AdminDashboard };
