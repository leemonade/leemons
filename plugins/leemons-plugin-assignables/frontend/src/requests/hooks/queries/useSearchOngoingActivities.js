import { useUserAgents } from '@assignables/components/Assignment/AssignStudents/hooks';
import { useQuery } from '@tanstack/react-query';
import searchOngoingActivities from '@assignables/requests/activities/searchOngoingActivities';
import { useVariantForQueryKey } from '@common/queries';
import { useIsTeacher } from '@academic-portfolio/hooks';
import {
  allOngoingActivitiesSearchKey,
  ongoingActivitiesSearchKey,
} from '../keys/ongoingActivities';

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
