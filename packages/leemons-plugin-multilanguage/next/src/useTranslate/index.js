import useSWR from 'swr';

function getLocalizations({ keys = null, keysStartsWith = null, locale } = {}) {
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
  return (url) =>
    fetch(url, {
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

export default ({ keys = null, keysStartsWith = null, locale } = {}) => {
  // Let swr handle data fetching and caching
  const { data, error } = useSWR(
    '/api/multilanguage/common',
    getLocalizations({ keys, keysStartsWith, locale })
  );

  // Add a loading property
  let loading = false;
  if (data === undefined && !error) {
    loading = true;
  }

  // Return in array for letting the user decide the names
  return [data, error, loading];
};
