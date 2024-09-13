import { getProgramsPublicInfoRequest } from '@academic-portfolio/request';
import { useQuery } from '@tanstack/react-query';

export default function useProgramsPublicInfo({
  programIds,
  withClasses = false,
  options: { enabled = true } = {},
}) {
  const programIdsNormalized = Array.isArray(programIds) ? programIds : [programIds];
  return useQuery({
    queryKey: ['programsPublicInfo', { programs: programIdsNormalized, withClasses }],
    queryFn: async () => getProgramsPublicInfoRequest(programIdsNormalized, withClasses),
    enabled,
  });
}
