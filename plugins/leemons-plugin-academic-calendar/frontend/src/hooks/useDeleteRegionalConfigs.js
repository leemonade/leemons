import { deleteRegionalConfigRequest } from '@academic-calendar/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getListRegionalConfigsKey } from './keys/listRegionalConfigs';

export const useDeleteRegionalConfigs = (centerId, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => deleteRegionalConfigRequest(id),
    onSuccess: () => {
      const queryKey = getListRegionalConfigsKey(centerId);
      queryClient.invalidateQueries(queryKey);
    },
    ...options,
  });
};

export default useDeleteRegionalConfigs;
