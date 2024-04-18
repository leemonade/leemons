import { listSubjectTypesRequest } from '@academic-portfolio/request';
import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { getSubjectTypesKey } from './keys/subjectTypes';

// TODO: HANDLE PAGINATION
export default function useSubjectTypes({ center, options }) {
  const queryKey = getSubjectTypesKey(center);

  const queryFn = () =>
    listSubjectTypesRequest({ center, page: 0, size: 200 }).then(
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
