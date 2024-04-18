import {
  createSubjectTypeRequest,
  deleteSubjectTypeRequest,
  updateSubjectTypeRequest,
} from '@academic-portfolio/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSubjectTypesKey } from '../keys/subjectTypes';

export function useUpdateSubjectType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => updateSubjectTypeRequest(props),
    onSuccess: (data) => {
      // Invalidate subject-types query for that center
      const queryKey = getSubjectTypesKey(data.subjectType.center);
      queryClient.invalidateQueries(queryKey);
    },
  });
}

export function useCreateSubjectType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => createSubjectTypeRequest(props),
    onSuccess: (data) => {
      // Invalidate subject-types query for that center
      const queryKey = getSubjectTypesKey(data.subjectType.center);
      queryClient.invalidateQueries(queryKey);
    },
  });
}

export function useDeleteSubjectType() {
  return useMutation({
    mutationFn: async (props) => deleteSubjectTypeRequest(props),
  });
}
