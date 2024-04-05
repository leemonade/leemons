import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

function useActiveUserAgentsCount(sysName, options = {}) {
  const queryKey = [
    {
      plugin: 'plugin.users',
      scope: 'activeUserAgentsCount',
      action: 'get',
      sysName,
    },
  ];

  const queryFn = () =>
    leemons.api(`v1/users/users/user-agents/active-count/${sysName}`, {
      method: 'GET',
      allAgents: true,
    });

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}

export { useActiveUserAgentsCount };
