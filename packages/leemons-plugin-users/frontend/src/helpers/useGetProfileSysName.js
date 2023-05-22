import { getCentersWithToken } from '@users/session';
import { useQuery } from '@tanstack/react-query';
import { getProfileSysNameRequest } from '@users/request';

export default function useGetProfileSysName(queryOptions = { cacheTime: Infinity }) {
  const { userAgentId } = getCentersWithToken()[0];

  const query = useQuery([userAgentId], () => getProfileSysNameRequest(), {
    ...queryOptions,
  });

  if (query.isSuccess) {
    return query.data.sysName || null;
  }

  return null;
}
