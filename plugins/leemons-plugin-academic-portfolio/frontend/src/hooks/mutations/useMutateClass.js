import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isArray } from 'lodash';

import { getClassStudentsKey } from '../keys/classStudents';
import { getProgramSubjectsKey } from '../keys/programSubjects';

import {
  addStudentsToClassRequest,
  createClassRequest,
  removeClassRequest,
  removeStudentFromClassRequest,
  updateClassRequest,
} from '@academic-portfolio/request';

export function useUpdateClass({ invalidateOnSuccess = true } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subject, ...props }) => updateClassRequest(props),
    onMutate: async (newClassData) => {
      const subjectKey = [
        'subjectDetail',
        { subject: newClassData.subject, withClasses: true, showArchived: false },
      ];

      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries(subjectKey);

      // Snapshot the previous value
      const previousSubjectData = queryClient.getQueryData(subjectKey);

      // Optimistically update the cache
      queryClient.setQueryData(subjectKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          classes:
            old.classes?.map((cls) =>
              cls.id === newClassData.id ? { ...cls, ...newClassData, status: 'updating' } : cls
            ) || [],
        };
      });

      // Return a context object with the snapshotted value
      return { previousSubjectData };
    },
    onError: (err, newClassData, context) => {
      console.error('err', err);

      const subjectKey = [
        'subjectDetail',
        { subject: newClassData.subject, withClasses: true, showArchived: false },
      ];

      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(subjectKey, context.previousSubjectData);
    },
    onSuccess: (data) => {
      if (invalidateOnSuccess) {
        const programSubjectKey = getProgramSubjectsKey(
          data.class?.program?.id ?? data.class?.program
        );
        const subjectKey = [
          'subjectDetail',
          { subject: data.class.subject?.id ?? data.class.subject },
        ];

        queryClient.invalidateQueries(programSubjectKey);
        queryClient.invalidateQueries(subjectKey);
      }
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

export function useEnrollStudentsToClasses({ invalidateOnSuccess = true } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => addStudentsToClassRequest(props),
    onSuccess: (data) => {
      if (invalidateOnSuccess) {
        const classes = isArray(data.class) ? data.class : [data.class];

        classes.forEach((cls) => {
          const programSubjectsKey = getProgramSubjectsKey(cls.program);
          queryClient.invalidateQueries(programSubjectsKey);
          const classStudentsKey = getClassStudentsKey(cls.id);
          queryClient.invalidateQueries(classStudentsKey);
        });
      }
    },
  });
}

export function useRemoveStudentFromClass() {
  return useMutation({
    mutationFn: async (props) => removeStudentFromClassRequest(props),
  });
}
