import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import getRole from '@assignables/roles/getRole';
import { rolesGetKey } from '../keys/roles';

export default function useRole({ role, ...options }) {
  const queryKey = rolesGetKey({ role });

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'occasionally',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn: () => getRole({ role }),
  });
}
