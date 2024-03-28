import { detailProgramRequest } from '@academic-portfolio/request';
import { useQueries } from '@tanstack/react-query';

export default function useProgramDetail(
  programId,
  { enabled = true } = {},
  withClasses,
  showArchived,
  withStudentsAndTeachers
) {
  const programIds = Array.isArray(programId) ? programId : [programId];

  const queries = useQueries({
    queries: programIds.map((id) => ({
      queryKey: ['programDetail', { program: id }],
      queryFn: async () => {
        const response = await detailProgramRequest(
          id,
          withClasses,
          showArchived,
          withStudentsAndTeachers
        );

        return response.program;
      },
      enabled,
    })),
  });

  if (Array.isArray(programId)) {
    return queries;
  }

  return queries[0];
}
