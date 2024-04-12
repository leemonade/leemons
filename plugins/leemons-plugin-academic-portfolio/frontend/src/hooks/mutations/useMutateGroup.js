import { updateGroupRequest } from '@academic-portfolio/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourseDetailKey } from '../keys/programCourse';

function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => updateGroupRequest(props),
    onSuccess: (data) => {
      const queryKey = getCourseDetailKey(data.id);
      queryClient.invalidateQueries(queryKey);
    },
  });
}

export default useUpdateGroup;
