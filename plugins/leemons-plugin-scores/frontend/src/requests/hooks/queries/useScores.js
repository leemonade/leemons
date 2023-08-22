import getScores from '@scores/requests/scores/getScores';
import { useQuery } from '@tanstack/react-query';
import { scoresSearchKey } from '../keys/scores';

function queryFn({ queryKey: [{ students, classes, gradedBy, periods, published }] }) {
  return getScores({ students, classes, gradedBy, periods, published });
}

export default function useScores({ students, classes, gradedBy, periods, published }, options) {
  const queryKey = scoresSearchKey({ students, classes, gradedBy, periods, published });

  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}
