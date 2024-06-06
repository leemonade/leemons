import { updateCourseRequest } from '@academic-portfolio/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourseDetailKey } from '../keys/programCourse';

function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (props) => updateCourseRequest(props),
    onSuccess: (data) => {
      const queryKey = getCourseDetailKey(data.course.id);
      queryClient.invalidateQueries(queryKey);
    },
  });
}

export default useUpdateCourse;
