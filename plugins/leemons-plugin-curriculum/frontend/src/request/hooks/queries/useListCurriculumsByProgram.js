import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { listCurriculumsByProgramRequest } from '@curriculum/request/';
import { allListCurriculumsByProgramKey, listCurriculumsByProgramKey } from '../keys/curriculum';

/**
 *
 * @param {string} program
 * @param {import("@common/queries/useVariantForQueryKey").QueryOptions} options
 */
export default function useListCurriculumsByProgram(program, options) {
  useVariantForQueryKey(allListCurriculumsByProgramKey, {
    modificationTrend: 'lazy',
  });

  const queryKey = listCurriculumsByProgramKey({ program });
  const queryFn = () => listCurriculumsByProgramRequest(program).then((request) => request.data);

  const query = useQuery({
    ...options,
    queryKey,
    queryFn,
  });

  return query;
}
