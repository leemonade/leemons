import { useMutation, useQueryClient } from '@tanstack/react-query';
import { savePackageRequest } from '../../index';
import { getPackageKey } from '../keys/packages';

export default function useMutatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => savePackageRequest(props),
    onSuccess: (data) => {
      const queryKey = getPackageKey(data.package.id);
      queryClient.invalidateQueries(queryKey);
    },
  });
}
