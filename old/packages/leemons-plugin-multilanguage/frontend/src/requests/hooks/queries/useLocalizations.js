import { useVariantForQueryKey } from '@common/queries';
import { useQuery } from '@tanstack/react-query';
import { localizationsGetKey } from '../keys/localizations';

function getLocalizations({ keys = null, keysStartsWith = null, locale } = {}) {
  // Get deduplicated keys
  let _keys = null;
  if (Array.isArray(keys)) {
    _keys = [...new Set(keys)];
  } else if (keys) {
    _keys = [...new Set([keys])];
  }

  // Get deduplicated keysStartsWith
  let _keysStartsWith = null;
  if (Array.isArray(keysStartsWith)) {
    _keysStartsWith = [...new Set(keysStartsWith)];
  } else if (keysStartsWith) {
    _keysStartsWith = [...new Set([keysStartsWith])];
  }

  let url = 'multilanguage/common';

  if (!locale) {
    url = 'multilanguage/common/logged';
  }
  // Get the desired localizations from the api
  return () =>
    leemons.api(url, {
      method: 'POST',
      // cache: {
      //   ttl: 1000 * 60 * 60, // 1h
      // },
      body: {
        keys: _keys,
        keysStartsWith: _keysStartsWith,
        locale,
      },
    });
}

export default function useLocalizations({ keys, keysStartsWith, locale, ...options }) {
  const queryKey = localizationsGetKey({ keys, keysStartsWith, locale });

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'frequently',
  });

  const { data, error } = useQuery({
    ...options,
    queryKey,
    queryFn: getLocalizations({ keys, keysStartsWith, locale }),
  });

  return { data, error, isLoading: !data?.items };
}
