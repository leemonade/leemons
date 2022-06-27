import { detailProgramRequest } from '@academic-portfolio/request';
import { useQueries } from 'react-query';

export default function useProgramDetail(programId, { enabled = true } = {}) {
  const programIds = Array.isArray(programId) ? programId : [programId];

  const queries = useQueries(
    programIds.map((id) => ({
      queryKey: ['programDetail', { program: id }],
      queryFn: async () => {
        const response = await detailProgramRequest(id);

        return response.program;
      },
      enabled,
    }))
  );

  if (Array.isArray(programId)) {
    return queries;
  }

  return queries[0];
}
