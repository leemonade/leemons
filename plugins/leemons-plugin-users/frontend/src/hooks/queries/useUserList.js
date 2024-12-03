import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

import { getUserListKey } from '../keys/usersKeys';

import { listUsersRequest } from '@users/request';

function useUserList({ params, options = {} } = {}) {
  const queryKey = getUserListKey(params);

  const queryFn = async () => {
    const result = await listUsersRequest(params);
    return result.data;
  };

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}

export { useUserList };
