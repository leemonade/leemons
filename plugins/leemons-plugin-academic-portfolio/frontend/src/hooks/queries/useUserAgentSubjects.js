import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { getSessionUserAgent } from '@users/session';

import { getUserAgentSubjectsKey } from '../keys/userSubjects';

import { getUserSubjectsRequest } from '@academic-portfolio/request';

export default function useUserAgentSubjects({ teacherTypeFilter, options = {} }) {
  const userAgentId = getSessionUserAgent();
  const queryKey = getUserAgentSubjectsKey(userAgentId, teacherTypeFilter);

  const queryFn = () => getUserSubjectsRequest(teacherTypeFilter).then((response) => response.data);

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
