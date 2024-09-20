import { classPublicDataManyRequest } from '@academic-portfolio/request';
import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

import { getClassPublicDataManyKey } from '../keys/classPublicData';

export default function useClassPublicDataMany({ ids, options }) {
  const queryKey = getClassPublicDataManyKey(ids);

  const queryFn = async () => {
    const response = await classPublicDataManyRequest(ids);
    return response.classes;
  };

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    ...options,
    refetchOnWindowFocus: false,
    queryKey,
    queryFn,
  });
}
