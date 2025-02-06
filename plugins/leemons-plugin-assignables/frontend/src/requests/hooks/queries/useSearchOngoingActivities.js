import { useIsTeacher } from '@academic-portfolio/hooks';
import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import useUserAgents from '@users/hooks/useUserAgents';

import {
  allOngoingActivitiesSearchKey,
  ongoingActivitiesSearchKey,
} from '../keys/ongoingActivities';

import searchOngoingActivities from '@assignables/requests/activities/searchOngoingActivities';

export default function useSearchOngoingActivities(filters, options) {
  const userAgents = useUserAgents();
  const isTeacher = useIsTeacher();

  useVariantForQueryKey(allOngoingActivitiesSearchKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    queryKey: ongoingActivitiesSearchKey({ isTeacher, userAgents, ...filters }),
    queryFn: () => searchOngoingActivities({ isTeacher, ...filters }),
    enabled:
      typeof isTeacher === 'boolean' &&
      (!!options?.enabled !== false || options?.enabled === undefined),
    ...options,
  });
}
