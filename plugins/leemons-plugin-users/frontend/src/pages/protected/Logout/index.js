import React from 'react';
import { useHistory } from 'react-router-dom';
import constants from '@users/constants';
import hooks from 'leemons-hooks';
import Cookies from 'js-cookie';
import { useDeploymentConfig } from '@deployment-manager/hooks/useDeploymentConfig';
import { LoadingOverlay } from '@bubbles-ui/components';

export default function Logout({ session }) {
  const history = useHistory();
  const deploymentConfig = useDeploymentConfig({ pluginName: 'users', ignoreVersion: true });

  React.useEffect(() => {
    if (deploymentConfig !== undefined && session) {
      Cookies.remove('token');
      const domain = /:\/\/([^/]+)/.exec(window.location.href)[1];
      const subdomain = domain.split('.')[0];
      if (Cookies.get(`token_${subdomain}`)) {
        Cookies.remove(`token_${subdomain}`);
      }

      if (deploymentConfig?.externalLogoutUrl && session.isSuperAdmin) {
        window.location.replace(deploymentConfig?.externalLogoutUrl);
      } else {
        history.push(`/${constants.base}`);
        hooks.fireEvent('user:cookie:session:change');
      }
    }
  }, [deploymentConfig, session]);

  return <LoadingOverlay visible />;
}
