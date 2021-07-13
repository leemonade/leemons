import React from 'react';
import PropTypes from 'prop-types';
import '../src/theme/leemons.css';
// import 'tailwindcss/tailwind.css';

function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default App;
