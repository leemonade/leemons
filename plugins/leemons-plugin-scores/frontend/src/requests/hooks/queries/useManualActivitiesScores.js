import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

import { manualActivityScoresKey } from '../keys/manualActivities';

import { getManualActivityScores } from '@scores/requests/manualActivities/scores/get';

/**
 * Hook to search for manual activities
 * @param {object} props
 * @param {string} props.classId - The class ID in LRN format
 * @param {string} props.startDate - The start date of the activities in ISO format
 * @param {string} props.endDate - The end date of the activities in ISO format
 * @param {import("@tanstack/react-query").UseQueryOptions} props.options - The options for the query
 */
export function useManualActivitiesScores({ classId, ...options }) {
  const queryKey = manualActivityScoresKey({ classId });
  const queryFn = () => getManualActivityScores(classId);

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'lazy',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
