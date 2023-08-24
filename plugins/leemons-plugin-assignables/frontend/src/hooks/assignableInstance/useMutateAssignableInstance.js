import { useMutation, useQueryClient } from '@tanstack/react-query';
import { instancesGetKey } from '@assignables/requests/hooks/keys/instances';
import updateAssignableInstance from '../../requests/assignableInstances/updateAssignableInstance';

export default function useMutateAssignableInstance(details = true) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (props) => {
      await updateAssignableInstance(props);
      return props;
    },
    onSuccess: (data) => {
      const queryKey = instancesGetKey({
        ids: data.id,
      });

      queryClient.invalidateQueries(queryKey);
    },
  });
}
