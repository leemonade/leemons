import { getCookieToken } from '@users/session';
import { useIsTeacher } from '@academic-portfolio/hooks';
import useAssignableInstances from '../assignableInstance/useAssignableInstancesQuery';
import useAssignations from './useAssignations';

export default function useAssignationsByProfile(ids) {
  const isTeacher = useIsTeacher();

  const token = getCookieToken(true);
  const user = token.centers[0].userAgentId;

  if (isTeacher) {
    return useAssignableInstances({ id: ids });
  }
  return useAssignations(ids?.map((id) => ({ instance: id, user })));

  // useEffect(async () => {
  //   if (isTeacher) {
  //     const teacherResults = await getAssignableInstances({ ids });

  //     setResults(teacherResults);
  //   } else {
  //     const studentResults = await getAssignations({ ids, user });

  //     setResults(studentResults);
  //   }

  //   setLoading(false);
  // }, [isTeacher, ids, user]);

  // return [results, loading];
}
