import { useQueries } from '@tanstack/react-query';
import { getConfig } from '@academic-calendar/request/config';

function useAcademicCalendarConfig(program) {
  const programs = Array.isArray(program) ? program : [program];

  const queries = useQueries({
    queries: programs.map((p) => ({
      queryKey: ['useAcademicCalendarConfig', { program: p }],
      queryFn: async () => {
        const { config } = await getConfig(p);
        return config;
      },
    })),
  });

  if (Array.isArray(program)) {
    return queries;
  }

  return queries[0];
}

export { useAcademicCalendarConfig };
