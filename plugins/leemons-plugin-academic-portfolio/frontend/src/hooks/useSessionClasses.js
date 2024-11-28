import { useQuery } from '@tanstack/react-query';
import useUserAgents from '@users/hooks/useUserAgents';

import { listSessionClassesRequest } from '../request';

/**
 *
 * @param {*} param0
 * @param {any} param0.type This parameter is set to main-teacher as default in the backend. Use `null` to get all the classes independent of the teacher type.
 * @returns
 */
export default function useSessionClasses(
  { program, type = ['main-teacher', 'associate-teacher'], showType, withProgram } = {},
  queryOptions = { cacheTime: Infinity }
) {
  const userAgents = useUserAgents();

  const queryKey = ['sessionClasses', { program, type }];

  const query = useQuery(
    queryKey,
    () =>
      listSessionClassesRequest({
        program,
        type,
        userAgents,
        withProgram,
      }),
    {
      ...queryOptions,
      enabled: queryOptions.enabled === false ? false : !!userAgents?.length,
    }
  );

  const queryInfo = { ...query };

  if (query.isSuccess) {
    queryInfo.data = query.data.classes;
  }

  if (showType && query.isSuccess) {
    queryInfo.data = queryInfo.data.map((klass) => {
      const teacher = klass.teachers.find((t) => userAgents.includes(t.teacher));
      const teacherType = teacher?.type;

      if (teacherType) {
        return { ...klass, type: teacherType };
      }
      return klass;
    });
  }

  return queryInfo;
}
