import { getCourseByIdRequest } from '@academic-portfolio/request';
import { useQuery } from '@tanstack/react-query';
import { useVariantForQueryKey } from '@common/queries';
import { getCourseDetailKey } from './keys/programCourse';

export default function useCourseDetail({ groupId, options }) {
  const queryKey = getCourseDetailKey(groupId);

  const queryFn = () => getCourseByIdRequest(groupId).then((response) => response.data);
  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });
  return useQuery({ ...options, queryKey, queryFn });
}
