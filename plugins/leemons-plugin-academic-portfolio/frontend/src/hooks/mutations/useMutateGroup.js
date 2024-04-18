import { updateGroupRequest } from '@academic-portfolio/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getGroupDetailKey } from '../keys/programGroup';

function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => updateGroupRequest(props),
    onSuccess: (data) => {
      const queryKey = getGroupDetailKey(data.group.id);
      queryClient.invalidateQueries(queryKey);
    },
  });
}

export default useUpdateGroup;
