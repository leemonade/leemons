import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  allAssignationsGetKey,
  assignationsGetKey,
} from '@assignables/requests/hooks/keys/assignations';
import updateStudentRequest from '../../request/instance/updateStudent';

export default function useStudentAssignationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: 'assignations',
    mutationFn: async (newData) => {
      await updateStudentRequest(newData);
      return newData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allAssignationsGetKey,
      });
    },
  });
}
