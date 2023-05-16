import getUserAgentsInfo from '@users/request/getUserAgentsInfo';
import { useQuery } from '@tanstack/react-query';

export default function useUserAgentsInfo(ids, options = {}) {
  const query = useQuery(
    ['userAgentsInfo', { ids }],
    () => getUserAgentsInfo(ids).then((res) => res.userAgents),
    options
  );

  return query;
}
