import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@common';
import { uniqBy, map } from 'lodash';
import { classByIdsRequest } from '../request';

async function getClasses(classes) {
  const request = await classByIdsRequest(classes);

  return request.classes;
}

export default function useClassesSubjects(classes) {
  const {
    data: classesData,
    error,
    isLoading,
  } = useQuery(['classes', { classes }], () => getClasses(classes));
  const defaultValue = useMemo(() => [], []);

  const value = useMemo(() => {
    if (!classesData?.length) {
      return defaultValue;
    }
    const subjects = map(classesData, 'subject');
    return uniqBy(subjects, 'id');
  }, [classesData, defaultValue]);

  if (isLoading) {
    return defaultValue;
  }
  if (error) {
    // TODO: Add error alert
    return defaultValue;
  }

  return value;
}
