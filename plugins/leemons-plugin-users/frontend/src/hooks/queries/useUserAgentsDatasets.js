import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { flatten, uniqBy } from 'lodash';

import { getUserDatasetsKey } from '../keys/userDatasetsKeys';

import { getDataForUserAgentDatasetsRequest } from '@users/request';

function useUserAgentsDatasets({ userAgentIds, ...options } = {}) {
  const queryKey = getUserDatasetsKey(userAgentIds);

  const queryFn = async () => {
    const result = await Promise.all(userAgentIds.map(getDataForUserAgentDatasetsRequest));
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

export { useUserAgentsDatasets };
