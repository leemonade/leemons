import React from 'react';
import { useHistory } from 'react-router-dom';

import { LoadingOverlay } from '@bubbles-ui/components';
import { useDeploymentConfig } from '@deployment-manager/hooks/useDeploymentConfig';
import Cookies from 'js-cookie';
import hooks from 'leemons-hooks';

import constants from '@users/constants';
import useProvider from '@users/request/hooks/queries/useProvider';

export default function Logout({ session }) {
  const history = useHistory();
  const deploymentConfig = useDeploymentConfig({ pluginName: 'users', ignoreVersion: true });
  const { data: provider, isLoading } = useProvider();

  React.useEffect(() => {
    if (isLoading) return;

    if (deploymentConfig !== undefined && session) {
      Cookies.remove('token');
      Cookies.remove('impersonated');
      const domain = /:\/\/([^/]+)/.exec(window.location.href)[1];
      const subdomain = domain.split('.')[0];
      if (Cookies.get(`token_${subdomain}`)) {
        Cookies.remove(`token_${subdomain}`);
      }

      if (deploymentConfig?.externalLogoutUrl && session.isSuperAdmin) {
        window.location.replace(deploymentConfig?.externalLogoutUrl);
      } else if (provider?.supportedMethods?.users?.logout) {
        window.location.replace(provider.supportedMethods.users.logout);
        hooks.fireEvent('user:cookie:session:change');
      } else {
        history.push(`/${constants.base}`);
        hooks.fireEvent('user:cookie:session:change');
      }
    }
  }, [deploymentConfig, session, isLoading, provider, history]);

  return <LoadingOverlay visible />;
}
