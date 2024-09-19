import { useLocale } from '@common/LocaleDate';
import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';

import { getProgramNomenclatureKey } from '../keys/programNomenclature';

import { getProgramNomenclatureRequest } from '@academic-portfolio/request';

export default function useProgramNomenclature({ programId, allLocales = false, options }) {
  const userLocale = useLocale();
  const localeFilter = allLocales ? undefined : userLocale;
  const queryKey = getProgramNomenclatureKey(programId, allLocales, localeFilter);

  const queryFn = () =>
    getProgramNomenclatureRequest({ programId, allLocales }).then(
      (response) => response.nomenclature[programId]
    );

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
