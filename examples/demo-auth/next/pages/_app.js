import _ from 'lodash';
import PropTypes from 'prop-types';
import hooks from 'leemons-hooks';
import React, { useEffect } from 'react';
import { frontPlugins, plugins } from '@plugins';
import { SessionProvider } from '@users/context/session';
import { getCookieToken } from '@users/session';
import 'simplebar/dist/simplebar.min.css';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import '../styles/globals.css';

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
      api: async (url, config) => {
        const urlConfig = url;
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
        const token = getCookieToken(true);
        if (config && token && !config.headers['Authorization']) {
          if (_.isString(token)) {
            config.headers['Authorization'] = token;
          } else {
            config.headers['Authorization'] = token.userToken;
            if (token.centers.length === 1) {
              config.headers['Authorization'] = token.centers[0].token;
            }
            if (_.isObject(urlConfig)) {
              if (urlConfig.allAgents) {
                config.headers['Authorization'] = JSON.stringify(_.map(token.centers, 'token'));
              } else if (urlConfig.centerToken) {
                config.headers['Authorization'] = urlConfig.centerToken;
              }
            }
          }
        }

        try {
          // No se devuelve directamente la respuesta por que si no el error no lo coge este try catch
          return await fetch(`${window.location.origin}/api/${url}`, config).then(async (r) => {
            if (r.status >= 500) {
              throw { status: r.status, message: r.statusText };
            }
            if (r.status >= 400) {
              throw await r.json();
            }
            return r.json();
          });
        } catch (err) {
          if (_.isString(err)) {
            throw { status: 500, message: err };
          } else if (!err.status) {
            throw { status: 500, message: err.message };
          } else {
            throw err;
          }
        }
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
