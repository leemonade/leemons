import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { filter, find, map } from 'lodash';

import { useProgramsForSubjectPicker } from './useProgramsForSubjectPicker';
import { useSubjectsForSubjectPicker } from './useSubjectsForSubjectPicker';

export function useDataForSubjectPicker({
  subjects,
  control,
  teacherType = ['main-teacher', 'associate-teacher'],
}) {
  const subjectsData = useSubjectsForSubjectPicker({ subjects, type: teacherType });
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

  const coursesHavingAvailableSubject = useMemo(() => {
    const _courses = [];
    subjectsDataOmittingSelected.forEach((subject) => {
      if (subject?.courses) _courses.push(...subject.courses);
    });

    return new Set(_courses);
  }, [subjectsDataOmittingSelected]);

  /*
    --- Get available data ---
  */

  const programs = useMemo(
    () =>
      map(
        filter(programsData, (programData) => programsHavingAvailableSubject.has(programData.id)),
        (p) => ({ label: p.name, value: p.id })
      ),
    [programsData, programsHavingAvailableSubject]
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
    let subjectsFiltered = subjectsDataOmittingSelected.filter(
      (subject) => subject?.program === program
    );
    if (selectedProgram?.hasCourses) {
      subjectsFiltered = subjectsFiltered.filter((subject) => subject?.courses?.includes(course));
    }

    return map(subjectsFiltered, (subject) => ({
      label: subject.name,
      value: subject.id,
    }));
  }, [subjectsDataOmittingSelected, program, course]);

  const selectedSubjectsData = useMemo(
    () =>
      map(selectedSubjects, (s) => {
        const subject = find(subjectsData, { id: s });
        const subjectProgram = find(programsData, { id: subject?.program });
        const subjectCourse =
          subject?.courses?.length === 1 &&
          find(subjectProgram?.courses, { id: subject?.courses[0] });

        return {
          id: s,
          programId: subjectProgram?.id,
          courseId: subjectCourse?.id,

          program: subjectProgram?.name,
          course: subjectCourse?.name,
          subject: subject?.name,
          color: subject?.color,
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
