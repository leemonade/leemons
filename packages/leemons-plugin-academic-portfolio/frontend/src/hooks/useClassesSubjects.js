import { useMemo } from 'react';
import { useApi } from '@common';
import { uniqBy, map } from 'lodash';
import { classDetailForDashboardRequest } from '../request';

function getClasses(classes) {
  return Promise.all(classes.map(classDetailForDashboardRequest));
}

export default function useClassesSubjects(classes) {
  const [classesData, error, loading] = useApi(getClasses, classes);
  const defaultValue = useMemo(() => [], []);

  const value = useMemo(() => {
    if (!classesData?.length) {
      return defaultValue;
    }

    const subjects = map(classesData, 'classe.subject');
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
