import React, { useCallback, useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, MAIN_NAV_WIDTH } from '@bubbles-ui/components';

import MainMenu from '@menu-builder/components/mainMenu';

import { AlertStack } from './AlertStack';
import { LayoutContext } from '../context/layout';

const PrivateLayoutStyles = createStyles((theme, { width}) => {
      return {
        root: {
          display: 'flex',
          height: '100vh'
        },
        sideNav: {
          width,
          height :'100%',
          overflowX: 'visible',
          transition: 'all 500ms ease-in-out'
        },
        content: {
          width: '100%',
          height: '100vh',
          overflowY: 'auto'
        }
      }
  });

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
    if (state.menuWidth !== 280) setState({ menuWidth: 280 });
  }, [state]);

  const { classes, cx} = PrivateLayoutStyles({ width: state.menuWidth });

  return (
    <Box className={classes.root}>
      <Box className={classes.sideNav}>
        <MainMenu onClose={onCloseMenu} onOpen={onOpenMenu} />
      </Box>
      <Box className={classes.content}>
        <AlertStack />
        {children}
      </Box>
    </Box>
  );
}

PrivateLayout.propTypes = {
  children: PropTypes.node,
};

export default PrivateLayout;
