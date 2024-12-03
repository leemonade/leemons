import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { flatten, uniqBy } from 'lodash';

import { getUserDatasetsKey } from '../keys/userDatasetsKeys';

import { getDataForUserDatasetsRequest } from '@users/request';

function useUserDatasets({ userIds, ...options } = {}) {
  const queryKey = getUserDatasetsKey(userIds);

  const queryFn = async () => {
    const result = await Promise.all(userIds.map(getDataForUserDatasetsRequest));
    return uniqBy(flatten(result?.map((item) => item.data) ?? []), 'locationName');
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

export { useUserDatasets };
