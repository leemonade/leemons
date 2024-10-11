import { useMutation, useQueryClient } from '@tanstack/react-query';

import { allAssignablesKey } from '../keys/assignables';

import deleteInstance from '@assignables/requests/assignableInstances/deleteInstance';

export default function useDeleteInstanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => {
      await deleteInstance(props);
      return props;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(allAssignablesKey);
    },
  });
}
