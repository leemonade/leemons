import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getRetakesKey } from '../keys/retakes';

import { addRetake } from '@scores/requests/retakes/add';

export function useAddRetakeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRetake,
    onSuccess: (_, { classId, period }) => {
      queryClient.invalidateQueries({
        queryKey: getRetakesKey({ classId, period }),
      });
    },
  });
}
