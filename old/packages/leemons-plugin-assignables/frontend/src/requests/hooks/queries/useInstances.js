import { useQuery } from '@tanstack/react-query';
import { useVariantForQueryKey } from '@common/queries';
import getAssignableInstances from '@assignables/requests/assignableInstances/getAssignableInstances';
import { head } from 'lodash';
import { instancesGetKey } from '../keys/instances';

export default function useInstances({
  id,
  ids,
  details = true,
  throwOnMissing,
  relatedInstances,
  ...options
}) {
  const instancesIds = id ?? ids ?? [];

  const queryKey = instancesGetKey({
    ids: instancesIds,
    details: !!details,
    throwOnMissing: !!throwOnMissing,
    relatedInstances: !!relatedInstances,
  });
  const queryFn = id
    ? () =>
      getAssignableInstances({
        ids: [instancesIds],
        details,
        throwOnMissing,
        relatedInstances,
      }).then(head)
    : () =>
      getAssignableInstances({ ids: instancesIds, details, throwOnMissing, relatedInstances });

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  const query = useQuery({
    queryKey,
    queryFn,
    ...options,
  });

  return query;
}
