import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Box, createStyles, LoadingOverlay, MAIN_NAV_WIDTH } from '@bubbles-ui/components';
import MainMenu from '@menu-builder/components/mainMenu';
import { getProfilesRequest } from '@academic-portfolio/request';
import { getCookieToken } from '@users/session';
import { useHistory } from 'react-router-dom';
import { useLayout } from '@layout/context';
import AlertStack from './AlertStack';

const NAV_OPEN_WIDTH = 280;

const PrivateLayoutStyles = createStyles((theme, { width }) => ({
  root: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
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
    position: 'relative',
  },
}));

const PrivateLayout = ({ children }) => {
  const { layoutState, setLayoutState, theme } = useLayout();
  const history = useHistory();

  const setState = (newState) => {
    setLayoutState({ ...layoutState, ...newState });
  };

  const handleChangeProfile = async () => {
    try {
      const profileState = { profileChecked: true, isAcademicMode: true };
      const token = getCookieToken(true);

      if (!isEmpty(token?.profile)) {
        try {
          const { profiles: academicProfiles } = await getProfilesRequest();

          profileState.isAcademicMode = [
            academicProfiles.teacher,
            academicProfiles.student,
          ].includes(token?.profile);
        } catch (error) {
          leemons.log.debug(error);
          // Possible super admin
          profileState.isAcademicMode = false;
        }
      }
      setState(profileState);
    } catch (error) {
      history.push('/users/login');
    }
  };

  useEffect(() => {
    if (!layoutState.menuWidth) {
      setState({ menuWidth: MAIN_NAV_WIDTH });
    }
  }, []);

  useEffect(() => {
    if (layoutState.private && !layoutState.profileChecked) {
      handleChangeProfile();
    }
  }, [layoutState.private]);

  // ····················································································
  // MENU HANDLERS

  const onCloseMenu = useCallback(() => {
    if (layoutState.menuWidth !== MAIN_NAV_WIDTH) setState({ menuWidth: MAIN_NAV_WIDTH });
  }, [layoutState]);

  const onOpenMenu = useCallback(() => {
    if (layoutState.menuWidth !== NAV_OPEN_WIDTH) setState({ menuWidth: NAV_OPEN_WIDTH });
  }, [layoutState]);

  const onPinMenu = useCallback(
    (pinned) => {
      setState({ menuWidth: pinned ? NAV_OPEN_WIDTH : MAIN_NAV_WIDTH });
    },
    [layoutState]
  );

  // ····················································································
  // RENDER & STYLES

  const { classes } = PrivateLayoutStyles({ width: layoutState.menuWidth });
  const pinned = false; // Must come from user preferences

  return layoutState.profileChecked ? (
    <Box className={classes.root}>
      <LoadingOverlay visible={layoutState.loading} />
      <Box className={classes.sideNav}>
        <MainMenu
          onClose={onCloseMenu}
          // onOpen={onOpenMenu}
          onPin={onPinMenu}
          subNavWidth={NAV_OPEN_WIDTH}
          pinned={pinned}
          lightMode={!theme.useDarkMode}
          mainColor={theme.menuMainColor}
          drawerColor={theme.menuDrawerColor}
          logoUrl={theme.squareLogoUrl}
        />
      </Box>
      <Box ref={layoutState.contentRef} className={classes.content}>
        <AlertStack />
        {children}
      </Box>
    </Box>
  ) : null;
};

PrivateLayout.propTypes = {
  children: PropTypes.node,
};

export default PrivateLayout;
