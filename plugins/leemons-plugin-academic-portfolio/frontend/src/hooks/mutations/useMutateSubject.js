import {
  createSubjectRequest,
  duplicateSubjectRequest,
  removeSubjectRequest,
  updateSubjectRequest,
} from '@academic-portfolio/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getProgramSubjectsKey } from '../keys/programSubjects';

export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => updateSubjectRequest(props),
    onSuccess: (data) => {
      const queryKey = getProgramSubjectsKey(data.subject?.program);
      queryClient.invalidateQueries(queryKey);
    },
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => createSubjectRequest(props),
    onSuccess: (data) => {
      const queryKey = getProgramSubjectsKey(data.subject?.program);
      queryClient.invalidateQueries(queryKey);
    },
  });
}

export function useDuplicateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => duplicateSubjectRequest(props),
    onSuccess: (data) => {
      const queryKey = getProgramSubjectsKey(data.subject?.program);
      queryClient.invalidateQueries(queryKey);
    },
  });
}

export function useDeleteSubject() {
  return useMutation({
    mutationFn: async (props) => removeSubjectRequest(props),
  });
}
