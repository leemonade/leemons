import { useQueries } from 'react-query';
import getAssignation from '../../requests/assignations/getAssignation';

export default function useAssignations(instances, details = true) {
  return useQueries(
    instances?.map(({ instance, user }) => ({
      queryKey: ['assignations', { instance, user, details }],
      queryFn: () => getAssignation({ id: instance, user, details }),
    })) || []
  );
}
