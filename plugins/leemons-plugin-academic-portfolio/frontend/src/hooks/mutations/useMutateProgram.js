import {
  createProgramRequest,
  removeProgramRequest,
  updateProgramRequest,
} from '@academic-portfolio/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCenterProgramsKey } from '../keys/centerPrograms';

export function useUpdateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (props) => updateProgramRequest(props),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['programDetail', { program: data.program.id }]);
    },
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (props) => createProgramRequest(props),
    onSuccess: (data) => {
      // Invaidate centerPrograms query
      const programCenters = data.program?.centers;
      programCenters?.forEach((centerId) => {
        const queryKey = getCenterProgramsKey(centerId);
        queryClient.invalidateQueries(queryKey);
      });
    },
  });
}

export function useArchiveProgram() {
  return useMutation({
    mutationFn: async (props) => removeProgramRequest(props),
  });
}
