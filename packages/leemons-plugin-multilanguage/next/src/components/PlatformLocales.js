import * as _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useAsync } from '@common/useAsync';
import { Tab, TabList, TabPanel, Tabs } from 'leemons-ui';
import { ExclamationIcon } from '@heroicons/react/outline';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { getDefaultPlatformLocaleRequest, getPlatformLocalesRequest } from '@users/request';

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

  useEffect(() => {
    if (locales.length && defaultLocale) {
      onLocaleChange(getConfig(locales, defaultLocale, index));
    }
  }, [index, locales, defaultLocale]);

  const getConfig = (_locales, _defaultLocale, i) => {
    return {
      currentLocaleIndex: i,
      currentLocale: _locales[i],
      currentLocaleIsDefaultLocale: _locales[i].code === _defaultLocale,
      defaultLocale: _defaultLocale,
      locales: _locales,
    };
  };

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
    () => ({ locale, locales: _locales }) => {
      const localeIndex = _.findIndex(_locales, { locale: locale });
      if (localeIndex >= 0) {
        const locale = _locales[localeIndex];
        _locales.splice(localeIndex, 1);
        _locales.unshift(locale);
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
      <Tabs activeIndex={index} setActiveIndex={setIndex}>
        <TabList>
          {locales.map(({ name, code }) => (
            <Tab key={code} id={`id-${code}`} panelId={`panel-${code}`}>
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

        {locales.map(({ code }) => (
          <TabPanel key={code} id={`panel-${code}`} tabId={`id-${code}`}>
            {React.cloneElement(children, { localeConfig: configs[code] })}
          </TabPanel>
        ))}
      </Tabs>
    );
  }

  return <ErrorAlert />;
}
