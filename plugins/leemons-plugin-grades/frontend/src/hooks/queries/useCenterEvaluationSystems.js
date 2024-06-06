import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { listGradesRequest } from '@grades/request';
import { getCenterEvaluationSystemsKey } from '../keys/centerEvaluationSystems';

export default function useCenterEvaluationSystems({ center, options }) {
  const queryKey = getCenterEvaluationSystemsKey(center);

  const queryFn = () =>
    listGradesRequest({ center, page: 0, size: 99999 }).then((response) => response.data?.items);

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
