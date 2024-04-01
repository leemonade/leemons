import { useQuery } from '@tanstack/react-query';
import { programHasSubjectHistoryRequest } from '@academic-portfolio/request';
import { useVariantForQueryKey } from '@common/queries';
import { getHasProgramSubjectHistoryKey } from '../keys/programHasSubjectHistory';

export default function useProgramHasSubjectHistory({ programId, options }) {
  const queryKey = getHasProgramSubjectHistoryKey(programId);

  const queryFn = () =>
    programHasSubjectHistoryRequest({ programId }).then((response) => response.data);

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
