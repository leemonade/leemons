import { useUserAgents } from '@assignables/components/Assignment/AssignStudents/hooks';
import { getUserCentersRequest } from '@users/request';
import { getCookieToken } from '@users/session';
import { useQuery } from '@tanstack/react-query';

export default function useUserCenters({ enabled = true } = {}) {
  const token = getCookieToken(true);

  const query = useQuery(
    ['userCenters', { token }],
    async () => {
      const response = await getUserCentersRequest();
      return response.centers;
    },
    {
      enabled,
    }
  );

  return query;
}
