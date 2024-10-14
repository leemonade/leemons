import { useLocale } from '@common/LocaleDate';
import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

import { fetchReportData } from '../../request/reports/fetchReportData';
import { getDataKey } from '../keys/reportKeys';

function useReportData({ options }) {
  const queryKey = getDataKey();
  const locale = useLocale();

  const queryFn = async () => {
    const result = await fetchReportData({ locale });
    return result?.data ?? [];
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

export { useReportData };
