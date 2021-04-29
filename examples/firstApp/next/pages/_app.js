import '../styles/globals.css';
import PropTypes from 'prop-types';
import hooks from "leemons-hooks";
import {useEffect, useRef} from "react";
import {plugins, frontPlugins} from "@plugins";

function MyApp({ Component, pageProps }) {
  const initialized = useRef(false);
  // Only add it once
  useEffect(() => {
    window.addEventListener('error', (e) => {
      e.preventDefault();
      console.error(e.error);
    });
  }, []);
  if (initialized.current === false) {
    // Define logger to console (temporal)
    global.leemons = {log: console};

    console.log('Frontend plugins:', frontPlugins.map(plugin => plugin.name));
    console.log('All the installed plugins:', plugins)
    frontPlugins.forEach(plugin => {
      plugin.load();
    });
    hooks.addFilter('user-admin::welcome_visited', ({args: [msg = [], ...args]}) => {
      console.log("Filter receives:", msg);
      return [[...msg, "Hello World"], ...args]
    });



    initialized.current = true;
  }
  return <Component {...pageProps} />;
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
