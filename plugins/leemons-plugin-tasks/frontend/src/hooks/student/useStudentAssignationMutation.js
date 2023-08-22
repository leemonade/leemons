import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateStudentRequest from '../../request/instance/updateStudent';

export default function useStudentAssignationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: 'assignations',
    mutationFn: async (newData) => {
      await updateStudentRequest(newData);
      return newData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([
        'assignations',
        { instance: data.instance, user: data.student },
      ]);
    },
  });
}
