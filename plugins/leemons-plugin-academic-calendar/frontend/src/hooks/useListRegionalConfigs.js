import { useQuery } from '@tanstack/react-query';
import { listRegionalConfigs } from '../request/regional-config';
import { getListRegionalConfigsKey } from './keys/listRegionalConfigs';

export const useListRegionalConfigs = (center, options = {}) => {
  const queryKey = getListRegionalConfigsKey(center);
  return useQuery({
    queryKey,
    queryFn: () => listRegionalConfigs(center),
    ...options,
  });
};

export default useListRegionalConfigs;
