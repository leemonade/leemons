import { classByIdsRequest } from '@academic-portfolio/request';
import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { getClassStudentsKey } from '../keys/classStudents';

// TODO: Implement function to only get students from a class in backend, this is a temporary solution as changes in backend must be avoided right now
export default function useClassStudents({ classId, options }) {
  const queryKey = getClassStudentsKey(classId);

  const queryFn = async () => {
    const response = await classByIdsRequest(classId);
    const data = response.classes[0];
    return data?.students ?? [];
  };

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    ...options,
    refetchOnWindowFocus: false,
    queryKey,
    queryFn,
  });
}
