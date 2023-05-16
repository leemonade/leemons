import { getUserProgramsRequest } from '@academic-portfolio/request';
import { getCookieToken } from '@users/session';
import { useQuery } from '@tanstack/react-query';

export default function usePrograms({ enabled = true } = {}) {
  const token = getCookieToken(true);

  const query = useQuery(
    ['userPrograms', { token }],
    async () => {
      const response = await getUserProgramsRequest();

      return response.programs;
    },
    {
      enabled,
    }
  );

  return query;
}
