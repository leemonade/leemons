import { useQuery } from '@tanstack/react-query';
import { useVariantForQueryKey } from '@common/queries';

import { useCallback } from 'react';
import getAssetsByIds from '@leebrary/request/getAssetsByIds';
import { getAssetsKey } from '../keys/assets';

export default function useAssets({ ids, filters, ...options }) {
  const queryKey = getAssetsKey(ids, filters);

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  const queryFn = useCallback(
    () => getAssetsByIds(ids, filters).then((r) => r.assets),
    [ids, filters]
  );

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
