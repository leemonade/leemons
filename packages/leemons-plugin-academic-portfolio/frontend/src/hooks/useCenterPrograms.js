import { listProgramsRequest } from '@academic-portfolio/request';
import { useQueries } from 'react-query';

export default function useCenterPrograms(centers, { enabled = true } = {}) {
  const _centers = Array.isArray(centers) ? centers : [centers];
  const queries = useQueries(
    _centers.map((center) => ({
      queryKey: ['listPrograms', { center }],
      queryFn: async () => {
        const response = await listProgramsRequest({ page: 0, size: 99999, center });

        return response.data.items;
      },
      enabled,
    }))
  );

  if (Array.isArray(centers)) {
    return queries;
  }
  return queries[0];
}
