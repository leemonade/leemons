import { userEnrollmentsRequest } from '@academic-portfolio/request';
import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

export default function useUserEnrollments({
  centerId,
  userAgentIds,
  contactUserAgentId,
  ...options
}) {
  const queryKey = [
    {
      plugin: 'plugin.academic-portfolio',
      scope: 'user-enrollments',
      centerId,
      userAgentIds,
      contactUserAgentId,
    },
  ];

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'occasionally',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn: () =>
      userEnrollmentsRequest({ centerId, userAgentIds, contactUserAgentId }).then(
        (res) => res.data
      ),
  });
}
