import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useUserAgents } from '@assignables/components/Assignment/AssignStudents/hooks';
import { listPeriodsRequest } from '@scores/requests';
import { useVariantForQueryKey } from '@common/queries';
import { allPaginatedPeriodsListsKey, paginatePeriodsListKey } from '../keys/periods';

async function queryFn({ queryKey: [{ page, size, query, sort }] }) {
  const response = await listPeriodsRequest({ page, size, query, sort });

  const { data } = response;

  data.items = data.items.map((period) => ({
    ...period,
    startDate: new Date(period.startDate),
    endDate: new Date(period.endDate),
  }));

  return data;
}

export default function usePeriods({ page, size, query, sort }, options) {
  const userAgents = useUserAgents();

  useVariantForQueryKey(allPaginatedPeriodsListsKey, {
    modificationTrend: 'lazy',
  });
  const queryKey = paginatePeriodsListKey({ page, size, query, sort, userAgents });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
    enabled: !!userAgents.length && options?.enabled,
  });
}
