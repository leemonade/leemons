import { useMutation, useQueryClient } from 'react-query';
import updateAssignableInstance from '../../requests/assignableInstances/updateAssignableInstance';

export default function useMutateAssignableInstance(details = true) {
  const queryClient = useQueryClient();
  return useMutation(updateAssignableInstance, {
    onSuccess: (data) => {
      const key = ['assignableInstances', { id: data.id, details }];
      // const previousData = queryClient.getQueryData(key);
      queryClient.invalidateQueries(key);
      // const data = queryClient.getQueryData(['assignableInstances', { id: data.id }]);
      // queryClient.setQueryData(['assignableInstances', { id: data.id, details: true }], data);
    },
  });
}
