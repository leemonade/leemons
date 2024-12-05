import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getUserDatasetsKey } from '../keys/userDatasetsKeys';

import { saveDataForUserDatasetsRequest } from '@users/request';

function useSaveUserDatasets({ userIds }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveDataForUserDatasetsRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(getUserDatasetsKey(userIds));
    },
  });
}

export { useSaveUserDatasets };
