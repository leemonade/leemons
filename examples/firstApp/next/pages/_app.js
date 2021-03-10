import '../styles/globals.css';
import propTypes from 'prop-types';
import React from 'react';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

MyApp.propTypes = {
  Component: propTypes.element.isRequired,
  pageProps: propTypes.object.isRequired,
};

export default MyApp;
