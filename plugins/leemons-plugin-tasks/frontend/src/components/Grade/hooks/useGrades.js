import { useApi } from '@common-frontend-react';
import { getGradeRequest } from '@grades/request';

export default function useGrades(evaluation) {
  const [grades] = useApi(getGradeRequest, evaluation);

  return grades?.grade?.scales;
}
