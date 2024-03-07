import { useFormContext, useWatch } from 'react-hook-form';
import useGroupedClasses from './useGroupedClasses';

export default function useGroupedClassesWithSelectedSubjects(disableGrouping) {
  const form = useFormContext();
  if (!form) {
    // TRANSLATE: This error should never happen and is a bug
    throw new Error('useGroupedClassesWithSelectedSubjects needs a FormContext');
  }

  const { control } = form;
  const subjects = useWatch({ name: 'subjects', control });

  const groupedClasses = useGroupedClasses(subjects, disableGrouping);
  return { ...groupedClasses, subjects };
}
