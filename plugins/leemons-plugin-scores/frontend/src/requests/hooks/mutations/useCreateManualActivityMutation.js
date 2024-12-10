import { useMutation, useQueryClient } from '@tanstack/react-query';

import { manualActivitiesSearchKey } from '../keys/manualActivities';

import { createManualActivity } from '@scores/requests/manualActivities/create';

/**
 * Hook to create a manual activity
 * @param {import("@tanstack/react-query").UseMutationOptions} options - The options for the mutation
 * @returns {import("@tanstack/react-query").UseMutationResult} The mutation result
 */
export function useCreateManualActivityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createManualActivity,
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({
        queryKey: manualActivitiesSearchKey({ classId }),
      });
    },
  });
}
