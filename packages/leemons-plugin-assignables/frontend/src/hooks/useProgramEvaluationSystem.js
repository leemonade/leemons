import { useApi } from '@common';
import _ from 'lodash';
import { getProgramEvaluationSystemRequest } from '@academic-portfolio/request';

export default function useProgramEvaluationSystem(instance) {
  const program = _.get(instance, 'assignable.subjects[0].program', null);

  const [result] = useApi(getProgramEvaluationSystemRequest, program);

  return result?.evaluationSystem;
}
