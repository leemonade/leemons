import { getDocumentRequest } from '@content-creator/request';
import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { getDocumentKey } from '../keys/document';

export default function useDocument({ id, ...options }) {
  const queryKey = getDocumentKey(id);

  const queryFn = () => getDocumentRequest(id).then((response) => response.document);

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
