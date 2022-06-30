import { useMutation, useQueryClient } from 'react-query';
import updateAssignableInstance from '../../requests/assignableInstances/updateAssignableInstance';

export default function useMutateAssignableInstance(details = true) {
  const queryClient = useQueryClient();
  return useMutation(updateAssignableInstance, {
    onSuccess: (data) => {
      const key = ['assignableInstances', { id: data.id, details }];
      queryClient.invalidateQueries(key);
    },
  });
}
