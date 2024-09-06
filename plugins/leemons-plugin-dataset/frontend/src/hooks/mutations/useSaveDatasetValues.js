import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postDatasetValuesRequest } from '../../request';
import { getValuesKey } from '../keys/datasetKeys';

function useSaveDatasetValues({ locationName, pluginName, targetId }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postDatasetValuesRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(getValuesKey({ locationName, pluginName, targetId }));
    },
  });
}

export { useSaveDatasetValues };
