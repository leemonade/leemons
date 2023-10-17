import { addPeriodRequest, removePeriodRequest } from '@scores/requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { allPeriodsKey } from '../keys/periods';

export default function usePeriodMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ period, action = 'write' }) => {
      if (action === 'write') {
        if (period.id) {
          throw new Error('Period updates are not supported yet');
        } else {
          const response = await addPeriodRequest(period);

          return response.period;
        }
      } else if (action === 'remove') {
        const response = await removePeriodRequest(period.id);

        return response.data;
      }

      throw new Error(`Unknown action '${action}'. Must be one of [write, remove]`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(allPeriodsKey);
    },
  });
}
