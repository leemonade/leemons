import PropTypes from 'prop-types';
import hooks from 'leemons-hooks';
import React, { useEffect } from 'react';
import { frontPlugins, plugins } from '@plugins';
import { SessionProvider } from '@users-groups-roles/context/session';

const Context = React.createContext(null);

function MyApp({ Component, pageProps }) {
  // Only add it once
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    window.addEventListener('error', (e) => {
      e.preventDefault();
      console.error(e.error);
    });
  }, []);

  // Only add it once (when leemons is not setted)
  if (!global.leemons) {
    // Define logger to console (temporal)
    global.leemons = {
      log: console,
      api: (url, config) => {
        return fetch(`${window.location.origin}/api/${url}`, config).then(async (r) => {
          if (r.status >= 400) {
            throw await r.json();
          }
          return r.json();
        });
      },
    };

    console.log(
      'Frontend plugins:',
      frontPlugins.map((plugin) => plugin.name)
    );
    console.log('All the installed plugins:', plugins);
    frontPlugins.forEach((plugin) => {
      plugin.load();
    });
    hooks.addFilter('user-admin::welcome_visited', ({ args: [msg = [], ...args] }) => {
      console.log('Filter receives:', msg);
      return [[...msg, 'Hello World'], ...args];
    });
  }

  return (
    <>
      <SessionProvider value={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
