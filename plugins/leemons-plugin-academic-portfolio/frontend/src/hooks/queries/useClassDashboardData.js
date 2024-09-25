import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

import { getClassDashboardDataKey } from '../keys/classPublicData';

import { classDetailForDashboardRequest } from '@academic-portfolio/request';

function useClassDashboardData({ classId, options }) {
  const queryKey = getClassDashboardDataKey(classId);

  const queryFn = async () => {
    const response = await classDetailForDashboardRequest(classId);
    return response.classe;
  };

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}

export { useClassDashboardData };
