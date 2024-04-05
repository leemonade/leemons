import { useQuery } from '@tanstack/react-query';
import { useVariantForQueryKey } from '@common/queries';

function useDeploymentType(options = {}) {
  const queryKey = 'deploymentType';

  const queryFn = async () =>
    leemons.api('deployment-manager/type', {
      method: 'GET',
      allAgents: true,
    });

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

export { useDeploymentType };
