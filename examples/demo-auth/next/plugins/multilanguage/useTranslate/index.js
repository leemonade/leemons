import useSWR from 'swr';
import * as _ from 'lodash';

function _getLocalizations({ keys = null, keysStartsWith = null, locale } = {}) {
  // Get deduplicated keys
  let _keys = null;
  if (Array.isArray(keys)) {
    _keys = [...new Set(keys)];
  }

  // Get deduplicated keysStartsWith
  let _keysStartsWith = null;
  if (Array.isArray(keysStartsWith)) {
    _keysStartsWith = [...new Set(keysStartsWith)];
  }

  // Throw if an error occurred
  // TODO: Get locale in backend form user session
  if (!locale) {
    return async () => {
      throw new Error('A locale must be provided');
    };
  }

  // Get the desired localizations from the api
  return () =>
    fetch('/api/multilanguage/common', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keys: _keys,
        keysStartsWith: _keysStartsWith,
        locale,
      }),
    }).then(async (response) => {
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.items;
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
  // Let swr handle data fetching and caching
  const { data, error } = useSWR('Translate', _getLocalizations({ keys, keysStartsWith, locale }));

  // Add a loading property
  let loading = false;
  if (data === undefined && !error) {
    loading = true;
  }

  // Return in array for letting the user decide the names
  return [data, error, loading];
};
