import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

import { fetchReportColumns } from '../../request/reports/fetchReportColumns';
import { getColumnsKey } from '../keys/reportKeys';

function useReportColumns({ options }) {
  const queryKey = getColumnsKey();

  const queryFn = async () => {
    const result = await fetchReportColumns();
    return result.data ?? [];
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

export { useReportColumns };
