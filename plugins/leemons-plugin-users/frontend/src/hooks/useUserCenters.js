import { useQuery } from '@tanstack/react-query';

import { getUserCentersRequest } from '@users/request';
import { getCookieToken } from '@users/session';

export default function useUserCenters(options) {
  const token = getCookieToken(true);

  return useQuery(
    ['userCenters', { token }],
    async () => {
      const response = await getUserCentersRequest();
      return response.centers;
    },
    options
  );
}
