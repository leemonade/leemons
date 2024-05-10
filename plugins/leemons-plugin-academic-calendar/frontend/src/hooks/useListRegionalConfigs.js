import { useQuery } from '@tanstack/react-query';
import { listRegionalConfigs } from '../request/regional-config';

export const useListRegionalConfigs = (center, options = {}) =>
  useQuery({
    queryKey: ['listRegionalConfigs', center],
    queryFn: () => listRegionalConfigs(center),
    ...options,
  });

export default useListRegionalConfigs;
