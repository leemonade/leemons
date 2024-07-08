import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveDataForUserAgentDatasetsRequest } from '@users/request';
import { getUserDatasetsKey } from '../keys/userDatasetsKeys';

function useSaveUserDatasets({ userAgentIds }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveDataForUserAgentDatasetsRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(getUserDatasetsKey(userAgentIds));
    },
  });
}

export { useSaveUserDatasets };
