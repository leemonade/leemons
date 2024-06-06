import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { listProfilesRequest } from '@users/request';

export default function useProfiles({ forceAll, ...options } = {}) {
  const queryKey = [
    {
      plugin: 'plugin.users',
      scope: 'profiles',
      forceAll,
    },
  ];

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'occasionally',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn: async () => {
      const result = await listProfilesRequest({
        page: 0,
        size: 99999,
        forceAll,
      });
      return result?.data?.items ?? [];
    },
  });
}
