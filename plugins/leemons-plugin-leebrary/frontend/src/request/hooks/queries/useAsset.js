import { useCallback } from 'react';

import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

import { fetchAssetByFile } from '../../fetchAssetByFile';
import getAsset from '../../getAsset';
import { getAssetByFileKey, getAssetsKey } from '../keys/assets';


function useAsset({ id, showPublic, fileId, ...options }) {
  let queryKey = getAssetsKey({ id });

  if (fileId) {
    queryKey = getAssetByFileKey(fileId);
  }

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  const queryFn = useCallback(() => {
    if (fileId) {
      return fetchAssetByFile(fileId).then((r) => r.data ?? {});
    }

    return getAsset(id, showPublic).then((r) => r.asset ?? {});
  }, [id, showPublic, fileId]);

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}

export default useAsset;
export { useAsset };
