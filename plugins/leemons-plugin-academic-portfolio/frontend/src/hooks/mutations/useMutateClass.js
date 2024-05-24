import { isArray } from 'lodash';
import {
  addStudentsToClassRequest,
  createClassRequest,
  removeClassRequest,
  removeStudentFromClassRequest,
  updateClassRequest,
} from '@academic-portfolio/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getProgramSubjectsKey } from '../keys/programSubjects';
import { getClassStudentsKey } from '../keys/classStudents';

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => updateClassRequest(props),
    onSuccess: (data) => {
      const queryKey = getProgramSubjectsKey(data.class?.program);
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(['subjectDetail', { subject: data.class.subject.id }]);
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

export function useEnrollStudentsToClasses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => addStudentsToClassRequest(props),
    onSuccess: (data) => {
      const classes = isArray(data.class) ? data.class : [data.class];

      classes.forEach((cls) => {
        const programSubjectsKey = getProgramSubjectsKey(cls.program);
        queryClient.invalidateQueries(programSubjectsKey);
        const classStudentsKey = getClassStudentsKey(cls.id);
        queryClient.invalidateQueries(classStudentsKey);
      });
    },
  });
}

export function useRemoveStudentFromClass() {
  return useMutation({
    mutationFn: async (props) => removeStudentFromClassRequest(props),
  });
}
