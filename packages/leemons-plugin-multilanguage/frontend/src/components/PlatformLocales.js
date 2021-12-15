import * as _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useAsync } from '@common/useAsync';
import { Tab, TabList, TabPanel, Tabs } from 'leemons-ui';
import { ExclamationIcon } from '@heroicons/react/outline';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { getDefaultPlatformLocaleRequest, getPlatformLocalesRequest } from '@users/request';
import * as PropTypes from 'prop-types';

export default function PlatformLocales({
  onLocaleChange = () => {},
  showWarning,
  warningIsError,
  children,
}) {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [locales, setLocales] = useState([]);
  const [configs, setConfigs] = useState({});
  const [defaultLocale, setDefaultLocale] = useState();
  const [error, setError, ErrorAlert] = useRequestErrorMessage();

  const getConfig = (_locales, _defaultLocale, i) => ({
    currentLocaleIndex: i,
    currentLocale: _locales[i],
    currentLocaleIsDefaultLocale: _locales[i].code === _defaultLocale,
    defaultLocale: _defaultLocale,
    locales: _locales,
  });

  useEffect(() => {
    if (locales.length && defaultLocale) {
      onLocaleChange(getConfig(locales, defaultLocale, index));
    }
  }, [index, locales, defaultLocale]);

  const getAllConfigs = (_locales, _defaultLocale) => {
    const result = {};
    _.forEach(_locales, (locale, i) => {
      result[locale.code] = getConfig(_locales, _defaultLocale, i);
    });
    return result;
  };

  const load = useMemo(
    () => async () => {
      const { locale } = await getDefaultPlatformLocaleRequest();
      const { locales: _locales } = await getPlatformLocalesRequest();
      return { locale, locales: _locales };
    },
    []
  );

  const onSuccess = useMemo(
    () =>
      ({ locale, locales: _locales }) => {
        const localeIndex = _.findIndex(_locales, { locale });
        if (localeIndex >= 0) {
          const _locale = _locales[localeIndex];
          _locales.splice(localeIndex, 1);
          _locales.unshift(_locale);
        }

        setConfigs(getAllConfigs(_locales, locale));
        setDefaultLocale(locale);
        setLocales(_locales);
        setLoading(false);
      },
    []
  );

  const onError = useMemo(
    () => (e) => {
      setError(e);
      setLoading(false);
    },
    []
  );

  useAsync(load, onSuccess, onError);

  if (!loading && !error) {
    return (
      <Tabs activeIndex={index}>
        <TabList>
          {locales.map(({ name, code }, i) => (
            <Tab
              key={code}
              id={`id-${code}`}
              panelId={`panel-${code}`}
              tabIndex={i}
              onClick={() => setIndex(i)}
            >
              {code === defaultLocale && showWarning ? (
                <ExclamationIcon
                  className={`w-4 h-4 mr-2 ${
                    warningIsError ? 'text-error-focus' : 'text-warning-focus'
                  }`}
                />
              ) : null}
              {name}
            </Tab>
          ))}
        </TabList>

        {locales.map(({ code }, i) => (
          <TabPanel key={code} id={`panel-${code}`} tabId={`id-${code}`} tabIndex={i}>
            {React.cloneElement(children, { localeConfig: configs[code] })}
          </TabPanel>
        ))}
      </Tabs>
    );
  }

  return <ErrorAlert />;
}

PlatformLocales.propTypes = {
  onLocaleChange: PropTypes.func,
  showWarning: PropTypes.bool,
  warningIsError: PropTypes.bool,
  children: PropTypes.node,
};
