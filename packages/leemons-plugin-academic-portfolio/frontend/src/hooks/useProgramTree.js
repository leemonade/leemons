import { getProgramTreeRequest } from '@academic-portfolio/request';
import { useQueries } from '@tanstack/react-query';

export default function useProgramTree(programId, { enabled = true }) {
  const programIds = Array.isArray(programId) ? programId : [programId];

  const queries = useQueries({
    queries: programIds.map((id) => ({
      queryKey: ['programTree', { program: id }],
      queryFn: async () => {
        const response = await getProgramTreeRequest(id);

        return response.tree;
      },
      enabled,
    })),
  });

  if (Array.isArray(programId)) {
    return queries;
  }

  return queries[0];
}
