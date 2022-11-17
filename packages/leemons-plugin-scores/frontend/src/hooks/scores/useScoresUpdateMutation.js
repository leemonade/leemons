import setScores from '@scores/requests/scores/setScores';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useScoresUpdateMutation() {
  const queryClient = useQueryClient();
  const queryKey = ['scores'];

  return useMutation(async ({ scores }) => setScores(scores), {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
}
