import { useMutation, useQueryClient } from '@tanstack/react-query';

import { allScoresKey } from '../keys/scores';

import setScores from '@scores/requests/scores/setScores';

export default function useScoresMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setScores,
    onSuccess: () => {
      queryClient.invalidateQueries(allScoresKey);
    },
  });
}
