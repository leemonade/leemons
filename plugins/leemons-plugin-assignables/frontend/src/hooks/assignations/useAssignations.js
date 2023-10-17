import { useQueries } from '@tanstack/react-query';
import getAssignation from '../../requests/assignations/getAssignation';

export default function useAssignations(instances, details = true, { enabled = true } = {}) {
  const _instances = (Array.isArray(instances) ? instances : [instances])?.filter(Boolean);
  const queries = useQueries({
    queries:
      _instances?.map(({ instance, user }) => ({
        queryKey: ['assignations', { instance, user, details }],
        queryFn: () => getAssignation({ id: instance, user, details }),
        enabled,
      })) || [],
  });

  if (Array.isArray(instances)) {
    return queries;
  }
  return queries[0];
}
