import { getZoneRequest } from '@widgets/getZone';
import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { getZoneKey } from '../keys/zones';

export default function useZone({ id, ...options }) {
  const queryKey = getZoneKey(id);
  const queryFn = async () => {
    const data = await getZoneRequest(id);
    return data.zone;
  };

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'standard',
  });

  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}
