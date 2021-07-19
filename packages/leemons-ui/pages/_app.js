import React from 'react';
import PropTypes from 'prop-types';
import '../src/theme/leemons.css';
import Layout from '../partials/Layout';

function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default App;
