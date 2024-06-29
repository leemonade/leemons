import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { isMainTeacherInSubjectRequest } from '@academic-portfolio/request';
import { getIsMainTeacherInSubjectKey } from '../keys/isMainTeacherInSubject';

export default function useIsMainTeacherInSubject({ subjectIds, options }) {
  const queryKey = getIsMainTeacherInSubjectKey(subjectIds);

  const queryFn = () =>
    isMainTeacherInSubjectRequest({ subjectIds }).then((response) => response.isMainTeacher);

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
