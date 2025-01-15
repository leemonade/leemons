import { useMemo } from 'react';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { map, sortBy } from 'lodash';

import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useProgramsPublicInfo } from '@academic-portfolio/hooks';

export function useProgramsForSubjectPicker({ programIds }) {
  const [t] = useTranslateLoader(prefixPN('newSubjectsPage.labels'));

  const { data, isLoading } = useProgramsPublicInfo({
    programIds,
    options: { enabled: !!programIds?.length },
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
      activateCoursesSelect: !(
        program?.moreThanOneAcademicYear || program?.maxNumberOfCourses === 1
      ),
      // TODO UPDATE THIS IN BACK & FRONT FOR IT TO BE: activateCoursesSelect: !(!program?.sequentialCourses || program?.maxNumberOfCourses === 1)),
    }));
  }, [data, isLoading, t]);
}

export default useProgramsForSubjectPicker;
