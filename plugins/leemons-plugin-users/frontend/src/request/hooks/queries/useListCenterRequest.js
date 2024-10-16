import { useQuery } from '@tanstack/react-query';

import listCenters from '../../listCenters';

function useListCenterRequest(body, options = {}) {
  return useQuery({
    queryKey: ['listCenters', body],
    queryFn: () => listCenters(body),
    ...options,
  });
}

export { useListCenterRequest };
