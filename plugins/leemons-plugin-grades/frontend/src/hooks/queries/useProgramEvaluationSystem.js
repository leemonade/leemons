import { useQuery } from '@tanstack/react-query';

import { useVariantForQueryKey } from '@common/queries';
import { getProgramEvaluationSystem } from '@academic-portfolio/request/programs';
import { getProgramEvaluationSystemKey } from '../keys/programEvaluationSystem';

export default function useProgramEvaluationSystems({ program, options }) {
  const queryKey = getProgramEvaluationSystemKey(program);

  const queryFn = () =>
    getProgramEvaluationSystem(program).then((response) => response.evaluationSystem);

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'occasionally',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
