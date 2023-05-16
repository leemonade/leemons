import { useEffect, useState } from 'react';
import { getCookieToken } from '@users/session';
import { useIsTeacher } from '@academic-portfolio/hooks';
import getAssignations from '../../../../requests/assignations/getAssignations';
import getAssignableInstances from '../../../../requests/assignableInstances/getAssignableInstances';

export default function useAssignationsByProfile(ids) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = getCookieToken(true);
  const user = token.centers[0].userAgentId;

  const isTeacher = useIsTeacher();

  useEffect(() => {
    (async () => {
      if (isTeacher) {
        const teacherResults = await getAssignableInstances({ ids });

        setResults(teacherResults);
      } else {
        const studentResults = await getAssignations({ ids, user });

        setResults(studentResults);
      }

      setLoading(false);
    })();
  }, [isTeacher, ids, user]);

  return [results, loading];
}
