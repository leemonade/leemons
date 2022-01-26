import React, { useCallback, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, LoadingOverlay, MAIN_NAV_WIDTH } from '@bubbles-ui/components';
import MainMenu from '@menu-builder/components/mainMenu';

import AlertStack from './AlertStack';
import { LayoutContext } from '../context/layout';

const NAV_OPEN_WIDTH = 280;

const PrivateLayoutStyles = createStyles((theme, { width }) => ({
  root: {
    display: 'flex',
    height: '100vh',
    position: 'relative',
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
  const { layoutState, setLayoutState } = useContext(LayoutContext);

  const setState = (newState) => {
    setLayoutState({ ...layoutState, ...newState });
  };

  useEffect(() => {
    if (!layoutState.menuWidth) {
      setState({ menuWidth: MAIN_NAV_WIDTH });
    }
  }, []);

  const onCloseMenu = useCallback(() => {
    if (layoutState.menuWidth !== MAIN_NAV_WIDTH) setState({ menuWidth: MAIN_NAV_WIDTH });
  }, [layoutState]);

  const onOpenMenu = useCallback(() => {
    if (layoutState.menuWidth !== NAV_OPEN_WIDTH) setState({ menuWidth: NAV_OPEN_WIDTH });
  }, [layoutState]);

  const { classes } = PrivateLayoutStyles({ width: layoutState.menuWidth });

  return (
    <Box className={classes.root}>
      <LoadingOverlay visible={layoutState.loading} />
      <Box className={classes.sideNav}>
        <MainMenu onClose={onCloseMenu} onOpen={onOpenMenu} subNavWidth={NAV_OPEN_WIDTH} />
      </Box>
      <Box ref={layoutState.contentRef} className={classes.content}>
        <AlertStack />
        {children}
      </Box>
    </Box>
  );
};

PrivateLayout.propTypes = {
  children: PropTypes.node,
};

export default PrivateLayout;
