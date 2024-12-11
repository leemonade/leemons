import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { useUserAgents } from '@users/hooks';

import { manualActivityScoresKey } from '../keys/manualActivities';

import { getMyManualActivityScores } from '@scores/requests/manualActivities/scores/myScores';

/**
 * Hook to search for manual activities of the current user
 * @param {object} props
 * @param {string} props.classId - The class ID in LRN format
 * @param {string} props.startDate - The start date of the activities in ISO format
 * @param {string} props.endDate - The end date of the activities in ISO format
 * @param {import("@tanstack/react-query").UseQueryOptions} props.options - The options for the query
 */
export function useMyManualActivitiesScores({ classId, ...options }) {
  const [user] = useUserAgents();
  const queryKey = manualActivityScoresKey({ classId, user });
  const queryFn = () => getMyManualActivityScores(classId);

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'lazy',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
