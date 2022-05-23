import { useMemo } from 'react';
import useTeacherClasses from './useTeacherClasses';

// EN: Get all the classes of a given subject of the teacher
// ES: Obtiene todas las clases de una asignatura del profesor
export default function useTeacherClassesOfSubject(subjects) {
  const classes = useTeacherClasses();

  return useMemo(() => {
    if (!subjects?.length) {
      return [];
    }
    return classes.filter((c) => subjects?.includes(c.subject));
  }, [subjects, classes]);
}
