import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useVariantForQueryKey } from '@common/queries';

import { getAssetsRequest } from '@leebrary/request';
import { getSimpleAssetListKey } from '../keys/simpleAssetList';

function useSimpleAssetList({ query, ...options }) {
  const queryKey = getSimpleAssetListKey(query);
  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  const queryFn = useCallback(
    () => getAssetsRequest({ ...query }).then((response) => response.assets ?? []),
    [query]
  );

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}

export default useSimpleAssetList;
export { useSimpleAssetList };
