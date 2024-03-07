import { listSubjectClassesRequest } from '@academic-portfolio/request';
import { useQuery } from '@tanstack/react-query';

export default function useSubjectClasses(subject, { enabled } = {}) {
  const query = useQuery(
    ['listSubjectClasses', { subject }],
    async () => {
      const response = await listSubjectClassesRequest({ page: 0, size: 9999, subject });

      return response.data.items;
    },
    {
      enabled,
    }
  );

  return query;
}
