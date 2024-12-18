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
    mutationFn: async (props) => updateClassRequest(props),
    onSuccess: (data) => {
      if (invalidateOnSuccess) {
        const queryKey = getProgramSubjectsKey(data.class?.program?.id ?? data.class?.program);
        queryClient.invalidateQueries(queryKey);
        queryClient.invalidateQueries([
          'subjectDetail',
          { subject: data.class.subject?.id ?? data.class.subject },
        ]);
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
