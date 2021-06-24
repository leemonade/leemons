import _ from 'lodash';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { plugins, frontPlugins } from '@plugins';
import 'leemons-ui/dist/theme/leemons.css';
import 'tailwindcss/tailwind.css';

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
        if (config && !config.headers) config.headers = {};
        if (config && !config.headers['content-type'])
          config.headers['content-type'] = 'application/json';
        if (config && _.isObject(config.body)) {
          config.body = JSON.stringify(config.body);
        }

        return fetch(`${window.location.origin}/api/${url}`, config).then(async (r) => {
          if (r.status >= 500) {
            throw { status: r.status, message: r.statusText };
          }
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
  }

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
