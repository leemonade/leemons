import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import { getCookieToken } from '@users/session';

export default function usePermissions({ name, ...options } = {}) {
  const token = getCookieToken(true);
  const userAgents = token?.profiles?.map((profile) => profile.userAgentId);

  const queryKey = [
    {
      plugin: 'plugin.users',
      scope: 'permissions',
      permission: name,
      userAgents,
    },
  ];

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn: async () => {
      const result = await getPermissionsWithActionsIfIHaveRequest(name);
      return result?.permissions;
    },
  });
}
