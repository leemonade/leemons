import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getUserAgentsDatasetsKey } from '../keys/userDatasetsKeys';

import { saveDataForUserAgentDatasetsRequest } from '@users/request';

function useSaveUserAgentsDatasets({ userAgentIds }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveDataForUserAgentDatasetsRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(getUserAgentsDatasetsKey(userAgentIds));
    },
  });
}

export { useSaveUserAgentsDatasets };
