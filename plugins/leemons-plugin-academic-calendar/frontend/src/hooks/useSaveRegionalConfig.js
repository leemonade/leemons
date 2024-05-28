import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveRegionalConfig } from '@academic-calendar/request/regional-config';
import { getListRegionalConfigsKey } from './keys/listRegionalConfigs';

export const useSaveRegionalConfig = (centerId, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => saveRegionalConfig(params),
    onSuccess: () => {
      const queryKey = getListRegionalConfigsKey(centerId);
      queryClient.invalidateQueries(queryKey);
    },
    ...options,
  });
};

export default useSaveRegionalConfig;
