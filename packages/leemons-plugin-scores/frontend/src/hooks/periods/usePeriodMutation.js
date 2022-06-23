import { addPeriodRequest } from '@scores/requests';
import { useMutation, useQueryClient } from 'react-query';

export default function usePeriodMutation() {
  const queryClient = useQueryClient();
  const queryKey = ['periods'];

  return useMutation(
    async (period) => {
      if (period.id) {
        throw new Error('Period updates are not supported yet');
      } else {
        const response = await addPeriodRequest(period);

        return response.period;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
}
