import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { useVariantForQueryKey } from '@common/queries';

function useDeploymentConfig({ pluginName, ignoreVersion, ...options }) {
  const queryKey = [
    {
      plugin: 'plugin.deployment-manager',
      scope: 'deploymentConfig',
      action: 'get',
      pluginName,
      ignoreVersion,
    },
  ];

  const queryFn = async () => {
    const data = await leemons.api('deployment-manager/config?allConfig=true', {
      method: 'GET',
      allAgents: true,
    });

    if (pluginName && data) {
      const keys = Object.keys(data);
      let result = null;
      _.forEach(keys, (key) => {
        if (ignoreVersion) {
          if (key.split('.')[1] === pluginName) {
            result = data[key];
          }
        } else if (key === pluginName) {
          result = data[key];
        }
      });
      return result;
    }

    return data;
  };

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn,
    ...options,
  });

  return isLoading ? undefined : data || null;
}

export { useDeploymentConfig };
