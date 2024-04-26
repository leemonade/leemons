import { useQuery } from '@tanstack/react-query';
import getWeights from '@scores/requests/weights/getWeights';
import { useVariantForQueryKey } from '@common/queries';
import useUserAgents from '@users/hooks/useUserAgents';
import { getWeightsKey } from '../keys/weights';

export default function useWeights({ classId, classIds, ...options }) {
  const userAgents = useUserAgents();
  const queryKey = getWeightsKey({ class: classId, classes: classIds, userAgents });

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'occasionally',
  });

  const queryFn = async () => {
    let weights = await getWeights({ classes: classId ? [classId] : classIds });

    if (!Array.isArray(weights)) {
      weights = [weights];
    }

    return classId ? weights[0] ?? null : weights;
  };

  return useQuery({
    ...options,

    queryKey,
    queryFn,
  });
}
