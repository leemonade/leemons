import '../styles/globals.css';
import React from 'react';
import PropTypes from 'prop-types';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

MyApp.propTypes = {
  Component: PropTypes.element.isRequire,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
