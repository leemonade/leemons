import { listKnowledgeAreasRequest } from '@academic-portfolio/request';
import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { getKnowledgeAreasKey } from './keys/knowledgeAreas';

// TODO: HANDLE PAGINATION
export default function useKnowledgeAreas({ center, options }) {
  const queryKey = getKnowledgeAreasKey(center);

  const queryFn = () =>
    listKnowledgeAreasRequest({ center, page: 0, size: 200 }).then(
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
