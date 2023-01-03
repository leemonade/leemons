import _ from 'lodash';
import { getProgramEvaluationSystemRequest } from '@academic-portfolio/request';
import { useQuery } from '@tanstack/react-query';

export default function useProgramEvaluationSystem(instance, { enabled } = {}) {
  const program =
    typeof instance === 'string'
      ? instance
      : _.get(instance, 'assignable.subjects[0].program', null);

  const { data } = useQuery(
    ['programEvaluationSystem', { program }],
    async () => {
      const response = await getProgramEvaluationSystemRequest(program);

      return response.evaluationSystem;
    },
    {
      enabled,
    }
  );

  return data;
}
