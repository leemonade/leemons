import { useQuery } from '@tanstack/react-query';

import { getRetakeScoresKey } from '../keys/retakes';

import { getRetakeScores } from '@scores/requests/retakes/scores/get';

/**
 * Hook to get the scores of a retake
 * @param {object} props
 * @param {string} props.classId - The class id
 * @param {string} props.period - The period
 * @param {import("@tanstack/react-query").UseQueryOptions} props.options - The options for the query
 */
export function useRetakesScores({ classId, period, ...options }) {
  const queryKey = getRetakeScoresKey({ classId, period });
  const queryFn = () => getRetakeScores({ classId, period });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
