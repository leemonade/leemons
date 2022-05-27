import { useMemo } from 'react';
import { useApi } from '@common';
import { uniqBy, map } from 'lodash';
import { classByIdsRequest } from '../request';

async function getClasses(classes) {
  const request = await classByIdsRequest(classes);

  return request.classes;
}

export default function useClassesSubjects(classes) {
  const [classesData, error, loading] = useApi(getClasses, classes);
  const defaultValue = useMemo(() => [], []);

  const value = useMemo(() => {
    if (!classesData?.length) {
      return defaultValue;
    }
    const subjects = map(classesData, 'subject');
    return uniqBy(subjects, 'id');
  }, [classesData, defaultValue]);

  if (loading) {
    return defaultValue;
  }
  if (error) {
    // TODO: Add error alert
    return defaultValue;
  }

  return value;
}
