import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

import { manualActivitiesSearchKey } from '../keys/manualActivities';

import { searchManualActivities } from '@scores/requests/manualActivities/search';

/**
 * Hook to search for manual activities
 * @param {object} props
 * @param {string} props.classId - The class ID in LRN format
 * @param {string} props.startDate - The start date of the activities in ISO format
 * @param {string} props.endDate - The end date of the activities in ISO format
 * @param {import("@tanstack/react-query").UseQueryOptions} props.options - The options for the query
 */
export function useManualActivities({ classId, startDate, endDate, search, ...options }) {
  const queryKey = manualActivitiesSearchKey({ classId, startDate, endDate, search });
  const queryFn = () => searchManualActivities({ classId, startDate, endDate, search });

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'lazy',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
