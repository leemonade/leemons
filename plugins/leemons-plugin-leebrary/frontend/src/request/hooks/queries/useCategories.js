import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

import { listCategoriesKey } from '../keys/categories';

import { listCategoriesRequest } from '@leebrary/request';

export default function useCategories(options) {
  const queryKey = listCategoriesKey;

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'occasionally',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn: listCategoriesRequest,
  });
}
