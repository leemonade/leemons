import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { useAsync } from '@common/useAsync';
import { TranslatorTabs } from '@bubbles-ui/leemons';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { getDefaultPlatformLocaleRequest, getPlatformLocalesRequest } from '@users/request';

export default function PlatformLocales({
  onLocaleChange = () => {},
  showWarning,
  warningIsError,
  children,
}) {
  const [loading, setLoading] = useState(true);
  const [locales, setLocales] = useState([]);

  const [defaultLocale, setDefaultLocale] = useState();
  const [error, setError, ErrorAlert] = useRequestErrorMessage();

  // ······························································································
  // INITIAL LOAD

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
        const localeIndex = findIndex(_locales, { locale });
        if (localeIndex >= 0) {
          const _locale = _locales[localeIndex];
          _locales.splice(localeIndex, 1);
          _locales.unshift(_locale);
        }
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

  // ······························································································
  // TRANSLATOR TAB PROPS

  const langs = useMemo(() => locales.map(({ name, code }) => ({ code, label: name })), [locales]);

  const errors = useMemo(() => {
    const result = [];
    if (showWarning && warningIsError) {
      result.push(defaultLocale);
    }
    return result;
  }, [showWarning, defaultLocale]);

  const warnings = useMemo(() => {
    const result = [];
    if (showWarning && !warningIsError) {
      result.push(defaultLocale);
    }
    return result;
  }, [showWarning, defaultLocale]);

  if (!loading && !error) {
    return (
      <TranslatorTabs
        locales={langs}
        errors={errors}
        warnings={warnings}
        defaultLocale={defaultLocale}
        onLocaleChange={onLocaleChange}
      >
        {children}
      </TranslatorTabs>
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
