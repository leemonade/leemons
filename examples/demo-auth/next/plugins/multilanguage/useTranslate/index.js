import useSWR from 'swr';
import * as _ from 'lodash';

function _getLocalizations({ keys = null, keysStartsWith = null, locale } = {}) {
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
      body: {
        keys: _keys,
        keysStartsWith: _keysStartsWith,
        locale,
      },
    });
}

export function getLocalizations(...data) {
  return _getLocalizations(...data)();
}

export function getLocalizationsByArrayOfItems(items, reducer, locale) {
  const keysToTranslate = [];
  _.forEach(items, (item) => {
    keysToTranslate.push(reducer(item));
  });
  return getLocalizations({
    keys: keysToTranslate,
    locale,
  });
}

export default ({ keys = null, keysStartsWith = null, locale } = {}) => {
  const jsonKey = JSON.stringify({ keys, keysStartsWith, locale });

  // Let swr handle data fetching and caching
  const { data, error } = useSWR(jsonKey, _getLocalizations({ keys, keysStartsWith, locale }));

  // Add a loading property
  let loading = false;
  if (data === undefined && !error) {
    loading = true;
  }

  // Return in array for letting the user decide the names
  return [data, error, loading];
};
