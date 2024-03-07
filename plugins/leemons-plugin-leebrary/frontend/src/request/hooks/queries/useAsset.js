import { useQuery } from '@tanstack/react-query';
import { useVariantForQueryKey } from '@common/queries';
import { useCallback } from 'react';
import getAsset from '@leebrary/request/getAsset';
import { getAssetsKey } from '../keys/assets';

function useAsset({ id, showPublic, ...options }) {
  const queryKey = getAssetsKey({ id });
  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  const queryFn = useCallback(() => getAsset(id, showPublic).then((r) => r.asset ?? {}), [id]);

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}

export default useAsset;
export { useAsset };
