import { useMutation, useQueryClient } from '@tanstack/react-query';

import { allAssignationsGetKey } from '@assignables/requests/hooks/keys/assignations';
import { allInstancesKey } from '@assignables/requests/hooks/keys/instances';
import { allNyaActivitiesSearchKey } from '@assignables/requests/hooks/keys/nyaActivities';
import updateStudentRequest from '../../request/instance/updateStudent';

export default function useStudentAssignationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: 'assignations',
    mutationFn: async (newData) => {
      await updateStudentRequest(newData);
      return newData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(allAssignationsGetKey);
      queryClient.invalidateQueries(allInstancesKey);
      queryClient.invalidateQueries(allNyaActivitiesSearchKey);
    },
  });
}
