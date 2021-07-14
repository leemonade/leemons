import React from 'react';
import PropTypes from 'prop-types';
import '../src/theme/leemons.css';
// import 'tailwindcss/tailwind.css';
import Sidebar from '../partials/Sidebar';

function App({ Component, pageProps }) {
  return (
    <Sidebar>
      <Component {...pageProps} />
    </Sidebar>
  );
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default App;
