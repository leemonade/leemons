import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getRetakeScoresKey } from '../keys/retakes';

import { setRetakeScore } from '@scores/requests/retakes/scores/set';

export function useSetRetakeScoreMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setRetakeScore,
    onSuccess: (_, { classId, period }) => {
      queryClient.invalidateQueries({
        queryKey: getRetakeScoresKey({ classId, period }),
      });
    },
  });
}
