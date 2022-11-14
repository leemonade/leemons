import getScores from '@scores/requests/scores/getScores';
import { useQuery } from '@tanstack/react-query';

export default function useScores({ students, classes, gradedBy, periods, published }) {
  const query = {
    students,
    classes,
    gradedBy,
    periods,
    published,
  };

  const resultQuery = useQuery(['scores', query], () => getScores(query));

  return resultQuery;
}
