import { useQueries } from '@tanstack/react-query';
import getAssignableInstance from '../../requests/assignableInstances/getAssignableInstance';

export default function useAssignableInstances({
  id,
  details = true,
  refetchInterval = 60000,
  enabled,
}) {
  const ids = (Array.isArray(id) ? id : [id]).filter(Boolean);

  const query = useQueries({
    queries: ids.map((_id) => ({
      queryKey: ['assignableInstances', { id: _id, details }],
      queryFn: () => getAssignableInstance({ id: _id, details }),
      refetchInterval,
      enabled,
    })),
  });

  if (Array.isArray(id)) {
    return query;
  }
  return query[0];
}
