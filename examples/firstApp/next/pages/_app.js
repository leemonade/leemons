import '../styles/globals.css';
import PropTypes from 'prop-types';
import hooks from "leemons-hooks";
import {useEffect, useRef} from "react";
import {plugins, frontPlugins} from "@plugins";

function MyApp({ Component, pageProps }) {
  const initialized = useRef(false);
  // Only add it once
  if (initialized.current === false) {
    console.log('Frontend plugins:', frontPlugins.map(plugin => plugin.name));
    console.log('All the installed plugins:', plugins)
    frontPlugins.forEach(plugin => {
      plugin.load();
    });
    hooks.addFilter('user-admin::welcome_visited', ({args: [msg = [], ...args]}) => {
      console.log("Filter receives:", msg);
      return [[...msg, "Hello World"], ...args]
    });


    global.leemons = {};

    initialized.current = true;
  }
  return <Component {...pageProps} />;
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
