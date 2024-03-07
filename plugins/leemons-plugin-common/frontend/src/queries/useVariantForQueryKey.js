import React from 'react';
import { useCache } from '@common/useCache';
import { useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'lodash';
import { cachingStrategy, modificationTrend, refetchFrequency } from './variants';

/**
 * @typedef {import('./types').QueryKey} QueryKey
 * @typedef {import("@tanstack/react-query").QueryOptions} QueryOptions
 * @typedef {import('./types').CachingStrategies} CachingStrategies
 * @typedef {import('./types').ModificationTrends} ModificationTrends
 * @typedef {import('./types').RefetchFrequencies} RefetchFrequencies
 *
 * @param {QueryKey} queryKey
 * @param {{
 *  cachingStrategy: CachingStrategies,
 *  modificationTrend: ModificationTrends,
 *  refetchFrequency: RefetchFrequencies
 * } | QueryOptions} variants
 */
export function useVariantForQueryKey(queryKey, variants) {
  const queryClient = useQueryClient();
  const cache = useCache();

  React.useEffect(() => {
    let queryOptions = {};

    if (variants.cachingStrategy || variants.modificationTrend || variants.refetchFrequency) {
      queryOptions = {
        ...(variants.cachingStrategy ? cachingStrategy(variants.cachingStrategy) : {}),
        ...(variants.modificationTrend ? modificationTrend(variants.modificationTrend) : {}),
        ...(variants.refetchFrequency ? refetchFrequency(variants.refetchFrequency) : {}),
      };
    } else {
      queryOptions = variants;
    }

    const queryDefaults = queryClient.getQueryDefaults(queryKey);

    if (!queryDefaults || !isEqual(queryDefaults, queryOptions)) {
      queryClient.setQueryDefaults(queryKey, queryOptions);
    }
  }, [queryClient, queryKey, cache('variants', variants)]);
}

export default useVariantForQueryKey;
