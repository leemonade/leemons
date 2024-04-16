import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

import listRoles from '@assignables/requests/roles/listRoles';
import { rolesListKey } from '../keys/roles';

export default function useRolesList({ details, ...options } = {}) {
  const queryKey = rolesListKey({ details });

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'occasionally',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn: () => listRoles({ details }),
  });
}
