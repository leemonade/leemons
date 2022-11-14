import { useUserAgents } from '@assignables/components/Assignment/AssignStudents/hooks';
import { useQuery } from '@tanstack/react-query';
import { listSessionClassesRequest } from '../request';

export default function useSessionClasses(
  { program, type, showType } = {},
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
      }),
    {
      ...queryOptions,
      enabled: queryOptions.enabled === false ? false : !!userAgents?.length,
    }
  );

  if (query.isSuccess) {
    query.data = query.data.classes;
  }

  if (showType && query.isSuccess) {
    query.data = query.data.map((klass) => {
      const teacher = klass.teachers.find((t) => userAgents.includes(t.teacher));
      const teacherType = teacher?.type;

      if (teacherType) {
        return { ...klass, type: teacherType };
      }
      return klass;
    });
  }

  return query;
}
