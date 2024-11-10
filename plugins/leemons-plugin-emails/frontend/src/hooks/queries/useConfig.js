import { useVariantForQueryKey } from '@common/queries';
import {
  useQuery,
} from '@tanstack/react-query';

import fetchConfig from '../../request/getConfig';
import { getConfigKey } from '../keys/configKeys';

function useConfig({ options }) {
  const queryKey = getConfigKey();

  const queryFn = async () => {
    const result = await fetchConfig();
    return result.configs;
  };

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}

export { useConfig };
