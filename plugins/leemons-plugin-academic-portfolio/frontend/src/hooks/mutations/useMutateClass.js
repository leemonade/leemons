import {
  createClassRequest,
  removeClassRequest,
  updateClassRequest,
} from '@academic-portfolio/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getProgramSubjectsKey } from '../keys/programSubjects';

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => updateClassRequest(props),
    onSuccess: (data) => {
      // Invaidate subject-types query for that center
      const queryKey = getProgramSubjectsKey(data.class?.program);
      queryClient.invalidateQueries(queryKey);
    },
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => createClassRequest(props),
    onSuccess: (data) => {
      const queryKey = getProgramSubjectsKey(data.class?.program);
      queryClient.invalidateQueries(queryKey);
    },
  });
}

export function useDeleteClass() {
  return useMutation({
    mutationFn: async (props) => removeClassRequest(props),
  });
}
