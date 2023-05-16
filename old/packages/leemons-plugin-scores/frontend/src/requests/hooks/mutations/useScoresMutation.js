import setScores from '@scores/requests/scores/setScores';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { allScoresKey } from '../keys/scores';

export default function useScoresMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scores }) => setScores(scores),
    onSuccess: () => {
      queryClient.invalidateQueries(allScoresKey);
    },
  });
}
