import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'lodash';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from '@bubbles-ui/components';
import { NotificationProvider } from '@bubbles-ui/notifications';
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
  const [layoutState, setLayoutState] = useState({ loading: false, contentRef: useRef() });
  const location = useLocation();

  const setPrivateLayout = (val) => {
    setLayoutState({ ...layoutState, private: val });
  };

  const setLoading = (loading) => {
    setLayoutState({ ...layoutState, loading });
  };

  const setContentRef = (contentRef) => {
    setLayoutState({ ...layoutState, contentRef });
  };

  const scrollTo = (props) => {
    if (!isNil(layoutState.contentRef?.current)) {
      layoutState.contentRef.current.scrollTo({ ...props, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (location && location.pathname) {
      const isPrivate = location.pathname.indexOf('/private') === 0;
      setPrivateLayout(isPrivate);
    }
  }, [location]);

  return (
    <ThemeProvider>
      <NotificationProvider leftOffset={layoutState.menuWidth}>
        <LayoutProvider
          value={{
            layoutState,
            setLayoutState,
            setPrivateLayout,
            setLoading,
            setContentRef,
            scrollTo,
          }}
        >
          <LayoutWrapper isPrivate={layoutState.private}>{children}</LayoutWrapper>
        </LayoutProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default LayoutContext;
