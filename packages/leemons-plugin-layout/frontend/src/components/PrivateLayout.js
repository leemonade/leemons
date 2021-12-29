import React, { useCallback, useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, MAIN_NAV_WIDTH, ThemeProvider } from '@bubbles-ui/components';
import MainMenu from '@menu-builder/components/mainMenu';

import AlertStack from './AlertStack';
import { LayoutContext } from '../context/layout';

const NAV_OPEN_WIDTH = 280;

const PrivateLayoutStyles = createStyles((theme, { width }) => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  sideNav: {
    width,
    height: '100%',
    overflowX: 'visible',
    transition: 'width 0ms ease-out',
  },
  content: {
    flex: 1,
    height: '100vh',
    overflowY: 'auto',
  },
}));

const PrivateLayout = ({ children }) => {
  const { state, setState: _setState } = useContext(LayoutContext);

  const store = useRef({});

  const setState = ({ ...rest }) => {
    store.current = { ...store.current, ...rest };
    _setState(store.current);
  };

  useEffect(() => {
    if (!state.menuWidth) {
      setState({ menuWidth: MAIN_NAV_WIDTH });
    }
  }, []);

  const onCloseMenu = useCallback(() => {
    if (state.menuWidth !== MAIN_NAV_WIDTH) setState({ menuWidth: MAIN_NAV_WIDTH });
  }, [state]);

  const onOpenMenu = useCallback(() => {
    if (state.menuWidth !== NAV_OPEN_WIDTH) setState({ menuWidth: NAV_OPEN_WIDTH });
  }, [state]);

  const { classes } = PrivateLayoutStyles({ width: state.menuWidth });

  return (
    <ThemeProvider>
      <Box className={classes.root}>
        <Box className={classes.sideNav}>
          <MainMenu onClose={onCloseMenu} onOpen={onOpenMenu} subNavWidth={NAV_OPEN_WIDTH} />
        </Box>
        <Box className={classes.content}>
          <AlertStack />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

PrivateLayout.propTypes = {
  children: PropTypes.node,
};

export default PrivateLayout;
