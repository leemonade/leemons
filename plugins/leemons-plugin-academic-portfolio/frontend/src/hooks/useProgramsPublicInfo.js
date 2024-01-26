import { getProgramsPublicInfoRequest } from '@academic-portfolio/request';
import { useQuery } from '@tanstack/react-query';

export default function useProgramsPublicInfo(programsId, { enabled = true } = {}) {
  const programIds = Array.isArray(programsId) ? programsId : [programsId];
  return useQuery({
    queryKey: ['programsPublicInfo', { programs: programIds }],
    queryFn: async () => getProgramsPublicInfoRequest(programIds),
    enabled,
  });
}
