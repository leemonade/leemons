import { useQueryClient, useMutation } from '@tanstack/react-query';

import registerWelcome from '@dashboard/request/welcome/registerWelcome';
import useUserAgents from '@users/hooks/useUserAgents';
import getWelcomeKey from '../keys/welcome';

export default function useCompleteWelcomeMutation() {
  const userAgents = useUserAgents();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: 'plugin.dashboards.welcome',
    mutationFn: registerWelcome,
    onSuccess: () => {
      queryClient.invalidateQueries(getWelcomeKey(userAgents));
    },
  });
}
