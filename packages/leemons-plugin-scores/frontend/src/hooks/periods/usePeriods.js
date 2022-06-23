import { useUserAgents } from '@assignables/components/Assignment/AssignStudents/hooks';
import { listPeriodsRequest } from '@scores/requests';
import { useQuery } from 'react-query';

export default function usePeriods({ page, size, query: q, sort }) {
  const userAgents = useUserAgents();
  const query = useQuery(
    [
      'periods',
      {
        page,
        size,
        query: q,
        sort,
        userAgents,
      },
    ],
    async () => {
      const response = await listPeriodsRequest({ page, size, query: q, sort });

      return response.data;
    }
  );
  return query;
}
