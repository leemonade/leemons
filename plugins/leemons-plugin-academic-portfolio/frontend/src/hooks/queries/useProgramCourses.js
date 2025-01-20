import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

import { getProgramCoursesKey } from '../keys/programCourses';

import { listCoursesRequest } from '@academic-portfolio/request';

export default function useProgramCourses({ programId, size, page, options }) {
  const queryKey = getProgramCoursesKey(programId, size, page);

  const queryFn = () =>
    listCoursesRequest({ program: programId }).then((response) => response.data);

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
