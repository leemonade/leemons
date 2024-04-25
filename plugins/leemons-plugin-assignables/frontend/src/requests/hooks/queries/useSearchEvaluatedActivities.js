import { useQuery } from '@tanstack/react-query';
import { useVariantForQueryKey } from '@common/queries';
import searchEvaluatedActivities from '@assignables/requests/activities/searchEvaluatedActivities';
import useUserAgents from '@users/hooks/useUserAgents';
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
