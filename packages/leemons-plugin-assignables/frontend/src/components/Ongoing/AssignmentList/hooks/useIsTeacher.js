import { useMemo } from 'react';

export default function useIsTeacher(assignations) {
  return useMemo(() => {
    if (!assignations?.length) {
      return false;
    }

    const isTeacher = assignations[0].students !== undefined;

    return isTeacher;
  }, [assignations]);
}
