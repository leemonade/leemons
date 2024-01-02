import React from 'react';
import { useHistory } from 'react-router-dom';
import constants from '@users/constants';
import hooks from 'leemons-hooks';
import Cookies from 'js-cookie';
import { useDeploymentConfig } from '@common/hooks/useDeploymentConfig';

export default function Logout() {
  const history = useHistory();
  const deploymentConfig = useDeploymentConfig({ pluginName: 'users', ignoreVersion: true });

  React.useEffect(() => {
    if (deploymentConfig !== undefined) {
      Cookies.remove('token');
      if (deploymentConfig?.externalLogoutUrl) {
        window.location.replace(deploymentConfig?.externalLogoutUrl);
      } else {
        history.push(`/${constants.base}`);
        hooks.fireEvent('user:cookie:session:change');
      }
    }
  }, [deploymentConfig]);

  return null;
}
