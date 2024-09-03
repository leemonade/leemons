import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

import { getDatasetSchemaRequest, getDatasetSchemaLocaleRequest } from '../../request';
import { getByLocationAndPluginKey } from '../keys/datasetKeys';

function useDatasetSchema({ locationName, pluginName, locale, options = {} }) {
  const queryKey = getByLocationAndPluginKey({ locationName, pluginName, locale });

  const queryFn = async () => {
    const fetchFn = locale ? getDatasetSchemaLocaleRequest : getDatasetSchemaRequest;
    const result = await fetchFn(locationName, pluginName, locale);

    return result.dataset;
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

export { useDatasetSchema };
