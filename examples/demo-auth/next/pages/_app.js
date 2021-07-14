import _ from 'lodash';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import hooks from 'leemons-hooks';
import React, { useEffect } from 'react';
import { frontPlugins, plugins } from '@plugins';
import { SessionProvider } from '@users/context/session';
import 'tailwindcss/tailwind.css';
// import 'leemons-ui/src/theme/leemons.css';
import 'simplebar/dist/simplebar.min.css';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

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
        if (_.isObject(url)) {
          let goodUrl = url.url;
          _.forIn(url.query, (value, key) => {
            goodUrl = _.replace(goodUrl, `:${key}`, value);
          });
          url = goodUrl;
        }
        if (!config) config = {};
        if (config && !config.headers) config.headers = {};
        if (config && !config.headers['content-type'] && !config.headers['Content-Type'])
          config.headers['content-type'] = 'application/json';
        if (config && _.isObject(config.body)) {
          config.body = JSON.stringify(config.body);
        }
        const token = Cookies.get('token');
        if (config && token && !config.headers['Authorization']) {
          config.headers['Authorization'] = token;
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
    hooks.addFilter('user-admin::welcome_visited', ({ args: [msg = [], ...args] }) => {
      console.log('Filter receives:', msg);
      return [[...msg, 'Hello World'], ...args];
    });
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <SessionProvider value={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </DndProvider>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
