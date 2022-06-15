import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { createI18n, I18nProvider } from 'react-simple-i18n';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { getSettingsRequest } from './src/request/settings';
import LocaleContext from './src/contexts/translations';

const Welcome = loadable(() => pMinDelay(import('./src/pages/public/Welcome'), 1000));
const Signup = loadable(() => pMinDelay(import('./src/pages/public/Signup'), 1000));

// ----------------------------------------------------------------------------
// USER REDIRECT COMPONENT

const UserRedirect = () => {
  const [loading, setLoading] = React.useState(true);
  const [redirectUrl, setRedirectUrl] = React.useState(null);
  const { loadLocale } = React.useContext(LocaleContext);

  const getSettings = async () => {
    setLoading(true);
    try {
      const response = await getSettingsRequest();

      if (response.settings?.lang) {
        loadLocale(response.settings?.lang);
      }

      if (response.settings?.configured) {
        setRedirectUrl('/private/dashboard');
      } else if (response.settings?.status === 'ADMIN_CREATED') {
        setRedirectUrl('/admin/login');
      } else if (response.settings?.status === 'LOCALIZED') {
        setRedirectUrl('/admin/signup');
      } else {
        setRedirectUrl('/admin/welcome');
      }

      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => getSettings(), []);

  if (loading) return <LoadingOverlay visible />;

  return <Redirect to={redirectUrl} />;
};

// ----------------------------------------------------------------------------
// LOCALE CONTAINER COMPONENT

const LocaleContainer = ({ children }) => {
  const [locale, setLocale] = React.useState('en');
  const [localeData, setLocaleData] = React.useState({});

  const loadLocale = async (lang) => {
    const response = await fetch(`/public/admin/i18n/${lang}.json`);
    const data = await response.json();
    setLocaleData(data);
    setLocale(lang);
  };

  React.useEffect(() => {
    const lang = (navigator.language || navigator.userLanguage).split('-')[0];
    loadLocale(lang);
  }, []);

  return (
    <LocaleContext.Provider value={{ loadLocale, locale }}>
      <I18nProvider i18n={createI18n({ [locale]: localeData }, { lang: locale })}>
        {children}
      </I18nProvider>
    </LocaleContext.Provider>
  );
};

LocaleContainer.propTypes = {
  children: PropTypes.node,
};

// ----------------------------------------------------------------------------
// PUBLIC ROUTES

export default function Public() {
  const { path } = useRouteMatch();

  return (
    <LocaleContainer>
      <Switch>
        <Route path={`${path}/welcome`}>
          <Welcome fallback={<LoadingOverlay visible />} />
        </Route>
        <Route path={`${path}/signup`}>
          <Signup fallback={<LoadingOverlay visible />} />
        </Route>
        <Route path={`${path}`}>
          <UserRedirect />
        </Route>
      </Switch>
    </LocaleContainer>
  );
}
