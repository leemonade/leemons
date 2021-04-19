import '../styles/globals.css';
import PropTypes from 'prop-types';
import hooks from "leemons-hooks";
import {useEffect, useRef} from "react";

function MyApp({ Component, pageProps }) {
  const initialized = useRef(false);
  // Only add it once
  if (initialized.current === false) {
    hooks.addFilter('user-admin::welcome_visited', (msg = [], ...args) => {
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
