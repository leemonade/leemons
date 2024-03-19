import { useQuery } from '@tanstack/react-query';
import { useVariantForQueryKey } from '@common/queries';
import { useCallback } from 'react';
import pMinDelay from 'p-min-delay';
import getAssetsByIds from '@leebrary/request/getAssetsByIds';
import { getAssetsKey } from '../keys/assets';

function useAssets({ ids, filters, timeout = 1000, ...options }) {
  const queryKey = getAssetsKey({ ids, filters });
  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  const queryFn = useCallback(
    () =>
      pMinDelay(
        getAssetsByIds(ids, filters).then((r) => r.assets ?? []),
        timeout
      ),
    [ids, filters, timeout]
  );

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}

export default useAssets;
export { useAssets };
