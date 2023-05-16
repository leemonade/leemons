import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { detailCurriculumRequest } from '@curriculum/request/';
import { allCurriculumDetailKey, curriculumDetailKey } from '../keys/curriculum';

/**
 *
 * @param {string} id
 * @param {import("@common/queries/useVariantForQueryKey").QueryOptions} options
 */
export default function useCurriculum(id, options) {
  useVariantForQueryKey(allCurriculumDetailKey, {
    modificationTrend: 'lazy',
  });

  const queryKey = curriculumDetailKey({ id });
  const queryFn = () => detailCurriculumRequest(id).then((request) => request.curriculum);

  const query = useQuery({
    ...options,
    queryKey,
    queryFn,
  });

  return query;
}
