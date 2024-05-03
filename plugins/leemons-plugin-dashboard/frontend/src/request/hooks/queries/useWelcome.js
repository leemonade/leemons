import { useQuery } from '@tanstack/react-query';

import hasCompletedWelcome from '@dashboard/request/welcome/hasCompletedWelcome';
import useUserAgents from '@users/hooks/useUserAgents';
import { useVariantForQueryKey } from '@common/queries';
import getWelcomeKey from '../keys/welcome';

export default function useWelcome(options) {
  const userAgents = useUserAgents();
  const queryKey = getWelcomeKey(userAgents);
  const queryFn = () => hasCompletedWelcome().then((r) => r.completed);

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'occasionally',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
