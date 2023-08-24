import SocketIoService from '@mqtt-socket-io/service';
import useLocalizations from '@multilanguage/requests/hooks/queries/useLocalizations';
import _ from 'lodash';
import React, { useMemo } from 'react';

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

function useUserLocale() {
  const [userLocale, setUserLocale] = React.useState(null);

  SocketIoService.useOn('USER_CHANGE_LOCALE', (e, event) => {
    setUserLocale(event.new);
  });

  return userLocale;
}

export default ({ keys = null, keysStartsWith = null, locale } = {}) => {
  const userLocale = useUserLocale();
  const localeToUse = useMemo(() => locale ?? userLocale, [userLocale, locale]);

  const { data, isLoading, error } = useLocalizations({
    keys,
    keysStartsWith,
    locale: localeToUse,
    enabled: !!localeToUse || !!keys?.length || !!keysStartsWith?.length,
    // placeholderData: {},
  });

  // Return in array for letting the user decide the names
  return [data, error, isLoading];
};
