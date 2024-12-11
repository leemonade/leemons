import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uniq } from 'lodash';

import { manualActivityScoresKey } from '../keys/manualActivities';

import { setManualActivityScores } from '@scores/requests/manualActivities/scores/set';

export function useSetManualActivityScoresMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setManualActivityScores,
    onSuccess: (_, { scores }) => {
      const classesIds = uniq(scores.map((score) => score.class));
      classesIds.forEach((classId) => {
        queryClient.invalidateQueries({
          queryKey: manualActivityScoresKey({ classId }),
        });
      });
    },
  });
}
