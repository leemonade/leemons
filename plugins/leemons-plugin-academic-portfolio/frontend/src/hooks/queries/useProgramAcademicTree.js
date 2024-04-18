import { getProgramAcademicTreeRequest } from '@academic-portfolio/request';
import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { getProgramTreeKey } from '../keys/programTree';

export default function useProgramAcademicTree({ programId, options }) {
  const queryKey = getProgramTreeKey(programId);

  const queryFn = () =>
    getProgramAcademicTreeRequest({ programId }).then((response) => response.tree);

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
