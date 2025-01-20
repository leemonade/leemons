import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

import { getCourseDetailKey } from './keys/programCourse';

import { getCourseByIdRequest } from '@academic-portfolio/request';

export default function useCourseDetail({ courseId, options }) {
  const queryKey = getCourseDetailKey(courseId);

  const queryFn = () => getCourseByIdRequest(courseId).then((response) => response.data);
  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });
  return useQuery({ ...options, queryKey, queryFn });
}
