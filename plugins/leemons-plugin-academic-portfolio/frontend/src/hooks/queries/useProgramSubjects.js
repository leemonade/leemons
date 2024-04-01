import { listSubjectsRequest } from '@academic-portfolio/request';
import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { getProgramSubjectsKey } from '../keys/programSubjects';

// TODO: HANDLE PAGINATION
export default function useProgramSubjects({ program, filters, options }) {
  const queryKey = getProgramSubjectsKey(program, filters);

  const queryFn = () =>
    listSubjectsRequest({ program, page: 0, size: 99999, ...filters }).then(
      (response) => response.data?.items
    );

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
