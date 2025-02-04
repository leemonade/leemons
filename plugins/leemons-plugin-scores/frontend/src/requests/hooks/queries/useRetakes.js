import { useQuery } from '@tanstack/react-query';

import { getRetakesKey } from '../keys/retakes';

import { getRetakes } from '@scores/requests/retakes/get';

/**
 * Hook to get the retakes of a class
 * @param {object} props
 * @param {string} props.classId - The class id
 * @param {string} props.period - The period
 * @param {import("@tanstack/react-query").UseQueryOptions} props.options - The options for the query
 */
export function useRetakes({ classId, period, ...options }) {
  const queryKey = getRetakesKey({ classId, period });
  const queryFn = () => getRetakes({ classId, period });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
