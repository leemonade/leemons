import { listProgramsRequest } from '@academic-portfolio/request';
import { useQueries } from '@tanstack/react-query';

export default function useCenterPrograms(centers, { enabled = true } = {}) {
  const _centers = Array.isArray(centers) ? centers : [centers];
  const queries = useQueries({
    queries: _centers.map((center) => ({
      queryKey: ['listPrograms', { center }],
      queryFn: async () => {
        const response = await listProgramsRequest({ page: 0, size: 99999, center });

        return response.data.items;
      },
      enabled,
    })),
  });

  if (Array.isArray(centers)) {
    return queries;
  }
  return queries[0];
}
