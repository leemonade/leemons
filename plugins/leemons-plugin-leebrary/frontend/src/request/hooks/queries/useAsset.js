import { useQuery } from '@tanstack/react-query';
import { useVariantForQueryKey } from '@common/queries';
import { useCallback } from 'react';
import getAsset from '@leebrary/request/getAsset';
import { getAssetsKey } from '../keys/assets';

function useAsset({ id, ...options }) {
  const queryKey = getAssetsKey({ id });
  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  const queryFn = useCallback(() => getAsset(id).then((r) => r.assets ?? []), [id]);

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}

export default useAsset;
export { useAsset };
