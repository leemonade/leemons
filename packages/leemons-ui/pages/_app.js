import React from 'react';
import PropTypes from 'prop-types';
import '../lib/theme/leemons.css';

function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default App;
