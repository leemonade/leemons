import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

import { getSubjectBlocksKey } from '../keys/subjectBlocks';

import { listBlocksBySubjectRequest } from '@academic-portfolio/request/blocks';

export default function useSubjectBlocks({ subjectId, page, size, options }) {
  const queryKey = getSubjectBlocksKey(subjectId);

  const queryFn = () =>
    listBlocksBySubjectRequest({ subjectId, page, size }).then((response) => response.data);

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
