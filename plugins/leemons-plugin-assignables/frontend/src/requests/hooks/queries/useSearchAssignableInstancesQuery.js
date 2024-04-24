import { useQuery } from '@tanstack/react-query';

import { useIsTeacher } from '@academic-portfolio/hooks';
import { useVariantForQueryKey } from '@common/queries';
import useUserAgents from '@users/hooks/useUserAgents';
import searchAssignableInstances from '../../assignableInstances/searchAssignableInstances';
import { searchInstancesKey } from '../keys/instances';

export default function useSearchAssignableInstances({ query = {}, ...options }) {
  const userAgents = useUserAgents();
  const isTeacher = useIsTeacher();

  const queryKey = searchInstancesKey({ ...query, userAgents });
  const queryFn = () => searchAssignableInstances({ ...query, isTeacher });

  useVariantForQueryKey(queryKey, { modificationTrend: 'frequently' });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
