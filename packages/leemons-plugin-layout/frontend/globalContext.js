import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from '@bubbles-ui/components';
import { LayoutContext, LayoutProvider } from './src/context/layout';
import PrivateLayout from './src/components/PrivateLayout';

function LayoutWrapper({ isPrivate, children }) {
  if (isPrivate) {
    return <PrivateLayout>{children}</PrivateLayout>;
  }
  return children;
}

LayoutWrapper.propTypes = {
  children: PropTypes.node,
  isPrivate: PropTypes.bool,
};

export function Provider({ children }) {
  const [layoutState, setLayoutState] = useState({});
  const location = useLocation();

  const setPrivateLayout = (val) => {
    setLayoutState({ ...layoutState, private: val });
  };

  useEffect(() => {
    if (location && location.pathname) {
      const isPrivate = location.pathname.indexOf('/private') === 0;
      setPrivateLayout(isPrivate);
    }
  }, [location]);

  return (
    <ThemeProvider>
      <LayoutProvider value={{ layoutState, setLayoutState, setPrivateLayout }}>
        <LayoutWrapper isPrivate={layoutState.private}>{children}</LayoutWrapper>
      </LayoutProvider>
    </ThemeProvider>
  );
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default LayoutContext;
