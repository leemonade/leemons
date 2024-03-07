import { get, isString } from 'lodash';
import { getProgramEvaluationSystemRequest } from '@academic-portfolio/request';
import { useQuery } from '@tanstack/react-query';

function getProgram(instance) {
  if (isString(instance)) {
    return instance;
  }

  return get(
    instance,
    'subjects[0].program',
    get(instance, 'assignable.subjects[0].program', null)
  );
}

export default function useProgramEvaluationSystem(instance, { enabled } = {}) {
  const program = getProgram(instance);

  const { data } = useQuery(
    ['programEvaluationSystem', { program }],
    async () => {
      const response = await getProgramEvaluationSystemRequest(program);

      return response.evaluationSystem;
    },
    {
      enabled: !!program && (enabled === undefined ? true : enabled),
    }
  );

  return data;
}
