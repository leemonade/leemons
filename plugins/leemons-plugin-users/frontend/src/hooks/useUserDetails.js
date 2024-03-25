import { useQuery } from '@tanstack/react-query';
import { getUserDetailForPageRequest } from '@users/request';

export default function useUserDetails({ userId, enabled = true } = {}) {
  return useQuery(
    ['userDetails', { userId }],
    async () => {
      const response = await getUserDetailForPageRequest(userId);
      return response.data;
    },
    {
      enabled,
    }
  );
}
