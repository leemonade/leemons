import { listProgramsRequest } from '@academic-portfolio/request';
import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { getCenterProgramsKey } from '../keys/centerPrograms';

// TODO: HANDLE PAGINATION
export default function useProgramsByCenter({ center, filters, options }) {
  const queryKey = getCenterProgramsKey(center, filters);

  const queryFn = () =>
    listProgramsRequest({ center, page: 0, size: 99999, ...filters }).then(
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
