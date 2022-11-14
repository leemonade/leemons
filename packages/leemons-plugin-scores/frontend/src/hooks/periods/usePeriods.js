import { useUserAgents } from '@assignables/components/Assignment/AssignStudents/hooks';
import { listPeriodsRequest } from '@scores/requests';
import { useQuery } from '@tanstack/react-query';

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

      const { data } = response;

      data.items = data.items.map((period) => ({
        ...period,
        startDate: new Date(period.startDate),
        endDate: new Date(period.endDate),
      }));

      return data;
    }
  );
  return query;
}
