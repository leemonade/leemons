import { useQuery } from '@tanstack/react-query';
import { useVariantForQueryKey } from '@common/queries';
import { head } from 'lodash';
import getAssignations from '@assignables/requests/assignations/getAssignations';
import { assignationsGetKey } from '../keys/assignations';

/**
 * Custom hook to fetch assignations based on provided query parameters.
 *
 * @param {Object} params - The parameters for fetching assignations.
 * @param {{instance: string, user: string} | {id: string}} [params.query] - The query to fetch assignations.
 * @param {({instance: string, user: string} | {id: string})[]} [params.queries] - The queries to fetch assignations.
 * @param {boolean} [params.details=true] - Whether to fetch detailed information.
 * @param {boolean} [params.throwOnMissing=true] - Whether to throw an error if an assignation is missing.
 * @param {boolean} [params.fetchInstance=false] - Whether to fetch the instance of the assignation.
 * @param {Object} options - Additional options for the query.
 * @returns The query object containing the fetched assignations.
 */

export default function useAssignations({
  query,
  queries,
  details = true,
  throwOnMissing,
  fetchInstance,
  ...options
}) {
  const assignationsQueries = query ?? queries ?? [];

  const queryKey = assignationsGetKey({
    id: query,
    ids: assignationsQueries,
    details: !!details,
    throwOnMissing: !!throwOnMissing,
    fetchInstance: !!fetchInstance,
  });
  const queryFn = query
    ? () =>
        getAssignations({
          queries: [assignationsQueries],
          details,
          throwOnMissing,
          fetchInstance,
        }).then(head)
    : () =>
        getAssignations({ queries: assignationsQueries, details, throwOnMissing, fetchInstance });

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}
