import { useUserAgents } from '@assignables/components/Assignment/AssignStudents/hooks';
import { useQuery } from '@tanstack/react-query';
import { useVariantForQueryKey } from '@common/queries';
import { useIsTeacher } from '@academic-portfolio/hooks';
import searchNyaActivities from '@assignables/requests/activities/searchNyaActivities';
import { allNyaActivitiesSearchKey, nyaActivitiesSearchKey } from '../keys/nyaActivities';

export default function useSearchNyaActivities(filters, options) {
  const userAgents = useUserAgents();
  const isTeacher = useIsTeacher();

  useVariantForQueryKey(allNyaActivitiesSearchKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    queryKey: nyaActivitiesSearchKey({ isTeacher, userAgents, ...filters }),
    queryFn: () => searchNyaActivities({ isTeacher, ...filters }),
    enabled:
      typeof isTeacher === 'boolean' &&
      (!!options?.enabled !== false || options?.enabled === undefined),
    ...options,
  });
}
