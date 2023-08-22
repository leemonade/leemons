import { useQuery } from '@tanstack/react-query';
import { getScormAssignationRequest } from '@scorm/request';
import { getAssignationKey } from '../keys/assignation';

export default function useAssignation({ instance, user, ...options }) {
  const queryKey = getAssignationKey({ instance, user });

  const queryFn = () =>
    getScormAssignationRequest({ instance, user }).then((request) => request.assignation);

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
