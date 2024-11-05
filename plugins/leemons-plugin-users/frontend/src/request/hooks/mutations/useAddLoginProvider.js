import { useMutation, useQueryClient } from '@tanstack/react-query';

import getProviderKey from '../keys/providers';

import activateProvider from '@users/request/activateProvider';

export default function useAddLoginProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (provider) => activateProvider(provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getProviderKey });
    },
  });
}
