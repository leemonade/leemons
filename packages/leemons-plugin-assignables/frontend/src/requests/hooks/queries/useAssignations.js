import { useQuery } from '@tanstack/react-query';
import { useVariantForQueryKey } from '@common/queries';
import { head } from 'lodash';
import getAssignations from '@assignables/requests/assignations/getAssignations';
import { assignationsGetKey } from '../keys/assignations';

// TODO: If details, fetch the instances
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

  const queryData = useQuery({
    queryKey,
    queryFn,
    ...options,
  });

  return queryData;
}
