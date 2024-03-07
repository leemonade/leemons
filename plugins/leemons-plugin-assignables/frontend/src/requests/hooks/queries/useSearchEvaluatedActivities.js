import { useUserAgents } from '@assignables/components/Assignment/AssignStudents/hooks';
import { useQuery } from '@tanstack/react-query';
import { useVariantForQueryKey } from '@common/queries';
import searchEvaluatedActivities from '@assignables/requests/activities/searchEvaluatedActivities';
import {
  allEvaluatedActivitiesSearchKey,
  evaluatedActivitiesSearchKey,
} from '../keys/evaluatedActivities';

export default function useSearchEvaluatedActivities(filters, options) {
  const userAgents = useUserAgents();

  useVariantForQueryKey(allEvaluatedActivitiesSearchKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    queryKey: evaluatedActivitiesSearchKey({ userAgents, ...filters }),
    queryFn: () => searchEvaluatedActivities(filters),
    ...options,
  });
}
