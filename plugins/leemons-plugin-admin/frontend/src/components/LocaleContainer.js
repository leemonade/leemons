import React from 'react';
import PropTypes from 'prop-types';
import { createI18n, I18nProvider } from 'react-simple-i18n';
import { getLocaleRequest } from '../request/locales';
import LocaleContext from '../contexts/translations';

// ----------------------------------------------------------------------------
// LOCALE CONTAINER COMPONENT

const LocaleContainer = ({ children }) => {
  const [locale, setLocale] = React.useState('en');
  const [localeData, setLocaleData] = React.useState({});

  const mounted = React.useRef(false);

  const loadLocale = async (lang) => {
    const response = await getLocaleRequest(lang, 'welcome');
    if (mounted.current) {
      setLocaleData(response.data || {});
      setLocale(lang);
    }
  };

  React.useEffect(() => {
    mounted.current = true;
    const lang = (navigator.language || navigator.userLanguage).split('-')[0];
    loadLocale(lang);

    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <LocaleContext.Provider value={{ loadLocale, locale }}>
      <I18nProvider i18n={createI18n(localeData, { lang: locale })}>{children}</I18nProvider>
    </LocaleContext.Provider>
  );
};

LocaleContainer.propTypes = {
  children: PropTypes.node,
};

export { LocaleContainer };
export default LocaleContainer;
