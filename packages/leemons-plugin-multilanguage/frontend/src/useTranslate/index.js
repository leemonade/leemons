import SocketIoService from '@mqtt-socket-io/service';
import _ from 'lodash';
import React from 'react';
import useSWR from 'swr';

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
      cache: {
        ttl: 1000 * 60 * 60, // 1h
      },
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

let retry = 0;

function retryMutate(fn) {
  if (retry > 0) {
    clearTimeout(retry);
  }

  retry = setTimeout(() => fn(), 2000);
}

export function getLocalizationsByArrayOfItems(items, reducer, locale) {
  let keysToTranslate = [];
  if (_.isFunction(reducer)) {
    _.forEach(items, (item) => {
      keysToTranslate.push(reducer(item));
    });
  } else {
    keysToTranslate = items;
  }
  return getLocalizations({
    keys: keysToTranslate,
    locale,
  });
}

export default ({ keys = null, keysStartsWith = null, locale } = {}) => {
  const [userLocale, setUserLocale] = React.useState(null);

  SocketIoService.useOn('USER_CHANGE_LOCALE', (e, event) => {
    setUserLocale(event.new);
  });

  if (!locale && userLocale) {
    // eslint-disable-next-line no-param-reassign
    locale = userLocale;
  }

  const jsonKey = JSON.stringify({ keys, keysStartsWith, locale });

  // Let swr handle data fetching and caching
  const { data, error, mutate, isValidating } = useSWR(
    jsonKey,
    _getLocalizations({ keys, keysStartsWith, locale })
  );

  if (mutate && data && _.isEmpty(data.items)) {
    retryMutate(mutate);
  }

  // Add a loading property
  const loading = !data && !error;

  // Return in array for letting the user decide the names
  return [data, error, loading];
};
