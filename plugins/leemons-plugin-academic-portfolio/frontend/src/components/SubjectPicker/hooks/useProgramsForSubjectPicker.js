import { useMemo } from 'react';

import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useProgramsPublicInfo } from '@academic-portfolio/hooks';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { map, sortBy, uniq } from 'lodash';

export function useProgramsForSubjectPicker({ subjects }) {
  const programIds = uniq(map(subjects, 'program'));
  const [t] = useTranslateLoader(prefixPN('newSubjectsPage.labels'));

  const { data, isLoading } = useProgramsPublicInfo({
    programIds,
    options: { enabled: !!programIds },
  });

  return useMemo(() => {
    if (isLoading) {
      return [];
    }

    return map(data?.programs, (program) => ({
      id: program?.id,
      name: program?.name,
      courses: sortBy(program?.courses, 'index').map(({ index, id }) => ({
        name: `${t('course')} ${index}`,
        id,
      })),
      hasCourses: !(program?.moreThanOneAcademicYear || program?.maxNumberOfCourses === 1),
      // TODO UPDATE THIS IN BACK & FRONT FOR IT TO BE: activateCoursesSelect: !(!program?.sequentialCourses || program?.maxNumberOfCourses === 1)),
    }));
  }, [data, isLoading, t]);
}

export default useProgramsForSubjectPicker;
