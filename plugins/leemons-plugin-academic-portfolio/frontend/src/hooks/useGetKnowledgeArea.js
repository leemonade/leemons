import { getKnowledgeAreaRequest } from '@academic-portfolio/request';
import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { getKnowledgeAreaKey } from './keys/knowledgeArea';

export default function useKnowledgeAreas({ id, options }) {
  const queryKey = getKnowledgeAreaKey(id);
  const queryFn = () => getKnowledgeAreaRequest(id).then((response) => response.data);

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
