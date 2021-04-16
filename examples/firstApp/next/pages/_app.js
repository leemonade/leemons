import '../styles/globals.css';
import PropTypes from 'prop-types';

function MyApp({ Component, pageProps }) {
  const components = {};
  global.leemons = {
    components,
    addComponent: (component) => {
      if (!components[component.name]) {
        components[component.name] = component.component;
        return components[component.name];
      }
      return null;
    },
    deleteComponent: (component) => {
      if (components[component]) {
        delete components[component];
        return true;
      }
      return false;
    },
  };
  return <Component {...pageProps} />;
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
