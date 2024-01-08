import { useMemo } from 'react';
import { filter, find, map } from 'lodash';
import { useWatch } from 'react-hook-form';
import { useProgramsForSubjectPicker } from './useProgramsForSubjectPicker';
import { useSubjectsForSubjectPicker } from './useSubjectsForSubjectPicker';

export function useDataForSubjectPicker({ subjects, control }) {
  const subjectsData = useSubjectsForSubjectPicker({ subjects });
  const programsData = useProgramsForSubjectPicker({ subjects: subjectsData });

  /*
    --- Selected data ---
  */

  const [program, course, selectedSubjects] = useWatch({
    control,
    name: ['program', 'course', 'selectedSubjects'],
  });

  const selectedProgram = useMemo(
    () => find(programsData, { id: program }),
    [programsData, program]
  );

  /*
    --- Filter-out selected subjects ---
  */

  const subjectsDataOmittingSelected = useMemo(() => {
    const selectedSubjectsIds = new Set(selectedSubjects);
    return subjectsData.filter((subjectData) => !selectedSubjectsIds.has(subjectData.id));
  }, [subjectsData, selectedSubjects]);

  const programsHavingAvailableSubject = useMemo(
    () => new Set(map(subjectsDataOmittingSelected, 'program')),
    [subjectsDataOmittingSelected]
  );

  const coursesHavingAvailableSubject = useMemo(
    () => new Set(map(subjectsDataOmittingSelected, 'course')),
    [subjectsDataOmittingSelected]
  );

  /*
    --- Get available data ---
  */

  const programs = useMemo(
    () =>
      map(
        filter(programsData, (programData) => programsHavingAvailableSubject.has(programData.id)),
        (p) => ({ label: p.name, value: p.id })
      ),
    [programsData]
  );

  const courses = useMemo(() => {
    if (selectedProgram?.hasCourses === false) {
      return null;
    }

    return (
      selectedProgram?.courses
        ?.filter((c) => coursesHavingAvailableSubject.has(c.id))
        ?.map((c) => ({ label: c.name, value: c.id })) ?? []
    );
  }, [selectedProgram?.courses]);

  const subjectsMatching = useMemo(() => {
    const subjectFilter = selectedProgram?.hasCourses ? { program, course } : { program };

    return map(filter(subjectsDataOmittingSelected, subjectFilter), (subject) => ({
      label: subject.name,
      value: subject.id,
    }));
  }, [subjectsDataOmittingSelected, program, course]);

  const selectedSubjectsData = useMemo(
    () =>
      map(selectedSubjects, (s) => {
        const subject = find(subjectsData, { id: s });
        const subjectProgram = find(programsData, { id: subject?.program });
        const subjectCourse = find(subjectProgram?.courses, { id: subject?.course });

        return {
          id: s,
          programId: subjectProgram?.id,
          courseId: subjectCourse?.id,

          program: subjectProgram?.name,
          course: subjectCourse?.name,
          subject: subject?.name,
        };
      }),
    [selectedSubjects, programsData, subjectsData]
  );

  return {
    programs,
    courses,
    subjects: subjectsMatching,
    selectedSubjects: selectedSubjectsData,
  };
}

export default useDataForSubjectPicker;
