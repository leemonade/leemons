import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateAssignableInstance from '../../requests/assignableInstances/updateAssignableInstance';

export default function useMutateAssignableInstance(details = true) {
  const queryClient = useQueryClient();
  return useMutation(
    async (props) => {
      await updateAssignableInstance(props);
      return props;
    },
    {
      onSuccess: (data) => {
        const key = ['assignableInstances', { id: data.id, details }];
        queryClient.invalidateQueries(key);
      },
    }
  );
}
