import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

import { fetchDatasetValuesRequest } from '../../request';
import { getValuesKey } from '../keys/datasetKeys';

function useDatasetValues({ locationName, pluginName, targetId, options }) {
  const queryKey = getValuesKey({ locationName, pluginName, targetId });

  const queryFn = async () => {
    const result = await fetchDatasetValuesRequest({
      locationName,
      pluginName,
      targetId,
    });

    return result.data;
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

export { useDatasetValues };
