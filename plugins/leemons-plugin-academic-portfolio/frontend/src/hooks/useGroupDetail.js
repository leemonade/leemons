import { getGroupByIdRequest } from '@academic-portfolio/request';
import { useQuery } from '@tanstack/react-query';
import { useVariantForQueryKey } from '@common/queries';
import { getGroupDetailKey } from './keys/programGroup';

export default function useGroupDetail({ groupId, options }) {
  const queryKey = getGroupDetailKey(groupId);

  const queryFn = () => getGroupByIdRequest(groupId).then((response) => response.data);
  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });
  return useQuery({ ...options, queryKey, queryFn });
}
