import { useQuery } from '@tanstack/react-query';
import { useVariantForQueryKey } from '@common/queries';
import { useCallback } from 'react';
import { getFileCopyrightRequest } from '@leebrary/request';
import { getFileCopyright } from '../keys/fileCopyright';

function useFileCopyright({ id, ...options }) {
  const queryKey = getFileCopyright({ id });
  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  const queryFn = useCallback(() => getFileCopyrightRequest(id).then((r) => r.data ?? null), [id]);

  return useQuery({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
    queryKey,
    queryFn,
  });
}

export default useFileCopyright;
export { useFileCopyright as useAsset };
